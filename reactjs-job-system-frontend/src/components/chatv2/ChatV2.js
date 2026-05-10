import React, { useState, useRef, useEffect, useContext } from 'react';
import './ChatV2.css';
import { MyUserContext } from '../../configs/MyContexts';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApis, endpoints } from '../../configs/Apis';
import cookie from 'react-cookies';

import ConversationSidebar from './ConversationSidebar';
import ChatScreen from './ChatScreen';
import InterviewPanel from './InterviewPanel';
import { Button, Container } from 'react-bootstrap';

const ChatV2 = () => {


  const location = useLocation();
  const nav = useNavigate();

  // ─── Routing state 
  const [isNew, setIsNew] = useState(location.state?.isNew ?? false);
  const receiverUser = location.state?.receiverUser;

  useEffect(() => {
    setIsNew(location.state?.isNew ?? false);
  }, [location.state?.isNew]);

  // ─── App state 
  const [user] = useContext(MyUserContext);
  const [activeChat, setActiveChat] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(false);

  // ─── Refs 
  const messagesAreaRef = useRef(null);

  // ─── Helpers 
  const scrollToBottom = () => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTo({
        top: messagesAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // ─── API calls
  const loadMyConvs = async () => {
    try {
      const res = await authApis().get(endpoints['my_convs']);
      setConversations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMyInterviews = async () => {
    try {
      setInterviewsLoading(true);
      const res = await authApis().get(endpoints['my_interviews']);
      setInterviews(Array.isArray(res.data) ? res.data : (res.data.results ?? []));
    } catch (error) {
      console.log('Interview load error:', error);
    } finally {
      setInterviewsLoading(false);
    }
  };

  const loadMessages = async (convId) => {
    try {
      const res = await authApis().get(endpoints['messages'](convId));
      setMessages([...res.data.results].reverse());
      setNextUrl(res.data.next);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreMessages = async () => {
    if (!nextUrl || loadingMore) return;
    try {
      setLoadingMore(true);
      await sleep(500);

      const res = await authApis().get(nextUrl);
      const previousScrollHeight = messagesAreaRef.current?.scrollHeight || 0;
      const olderMessages = [...res.data.results].reverse();

      setMessages(prev => [...olderMessages, ...prev]);
      setNextUrl(res.data.next);

      requestAnimationFrame(() => {
        if (messagesAreaRef.current) {
          messagesAreaRef.current.scrollTop =
            messagesAreaRef.current.scrollHeight - previousScrollHeight;
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMore(false);
    }
  };

  // ─── Handlers 
  const handleActiveChat = (conv) => {
    setActiveChat(conv);
    loadMessages(conv.id);
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0) loadMoreMessages();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isCreating) return;

    // Trường hợp 1: Chat với người mới
    if (isNew && !activeChat?.id) {
      setIsCreating(true);
      try {
        const res = await authApis().post(endpoints['get_or_create_conv'], {
          receiverId: receiverUser.id,
        });
        const newConv = res.data;

        setActiveChat(newConv);
        setIsNew(false);

        if (window.history.state?.usr) {
          window.history.replaceState(
            { ...window.history.state, usr: { ...window.history.state.usr, isNew: false } },
            ''
          );
        }

        loadMyConvs();
      } catch (error) {
        console.error('Lỗi khi tạo hội thoại:', error);
      } finally {
        setIsCreating(false);
      }
      return;
    }

    // Trường hợp 2: Đã có hội thoại
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message: inputValue }));
      setInputValue('');
    }
  };

  // ─── Effects 

  // WebSocket per conversation
  useEffect(() => {
    if (!activeChat?.id) return;

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${activeChat.id}/?token=${cookie.load('token')}`
    );

    ws.onopen = () => {
      console.log('WS connected');
      if (inputValue.trim()) {
        ws.send(JSON.stringify({ message: inputValue }));
        setInputValue('');
      }
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages(prev => {
        if (prev.find(m => m.id === data.id)) return prev;
        return [...prev, data];
      });
    };

    ws.onclose = () => console.log('WS disconnected');

    setSocket(ws);
    return () => ws.close();
  }, [activeChat]);

  // Conversations WebSocket (global)
  useEffect(() => {
    loadMyConvs();
    loadMyInterviews();

    const convsWs = new WebSocket(
      `ws://127.0.0.1:8000/ws/conversations/?token=${cookie.load('token')}`
    );

    convsWs.onopen = () => console.log('Conversations WS connected');

    convsWs.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (Array.isArray(data)) {
        setConversations(data);
      } else if (data?.id) {
        setConversations(prev => {
          const newList = [...prev];
          const index = newList.findIndex(c => c.id === data.id);
          if (index !== -1) {
            newList[index] = { ...newList[index], ...data };
            const [moved] = newList.splice(index, 1);
            newList.unshift(moved);
          } else {
            newList.unshift(data);
          }
          return newList;
        });
      } else {
        loadMyConvs();
      }
    };

    convsWs.onclose = () => console.log('Conversations WS disconnected');
    return () => convsWs.close();
  }, []);

  // Auto-scroll on new message
  const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;
  useEffect(() => {
    scrollToBottom();
  }, [lastMessageId, activeChat]);

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (!user || user === null) {
    return (
      <Container className="my-5 text-center">
        <h5>Bạn cần đăng nhập để tiếp tục</h5>
        <Button variant="success" size="sm" className="mt-2" onClick={() => nav("/login")}>
          Đăng nhập
        </Button>
      </Container>
    );
  }

  return (
    <div className="chatv2-wrapper">
      <div className="chatv2-container">
        <ConversationSidebar
          conversations={conversations}
          activeChat={activeChat}
          onSelectChat={handleActiveChat}
        />

        <ChatScreen
          activeChat={activeChat}
          isNew={isNew}
          receiverUser={receiverUser}
          messages={messages}
          user={user}
          inputValue={inputValue}
          loadingMore={loadingMore}
          messagesAreaRef={messagesAreaRef}
          onScroll={handleScroll}
          onInputChange={(e) => setInputValue(e.target.value)}
          onSendMessage={handleSendMessage}
          onInterviewCreated={loadMyInterviews}
        />

        <InterviewPanel
          interviews={interviews}
          loading={interviewsLoading}
          onRefresh={loadMyInterviews}
          currentUser={user}
        />
      </div>
    </div>
  );
};

export default ChatV2;
