import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ConversationsBar from './ConversationsBar';
import ChatScreen from './ChatScreen';
import { getChatId, subscribeToConversations, subscribeToMsg } from '../../services/serviceChat';
import { useLocation } from 'react-router-dom';
import { authApis, endpoints } from '../../configs/Apis';
import { MyUserContext } from '../../configs/MyContexts';

function Chat() {
    const location = useLocation();
    const locationReceiverUser = location.state?.receiverUser;
    const locatioSenderId = location.state?.senderId;

    const [chatId, setChatId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [user,] = useContext(MyUserContext);
    const [loading, setLoading] = useState(false);
    const [receiverUser, setReceiverUser] = useState();
    const [userId, setUserId] = useState(0);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        try {
            setLoading(true);
            setUserId(user?.id);
            if (user) {
                const unsub = subscribeToConversations(user.id, async (convs) => {
                    try {
                        const fullConvs = await Promise.all(convs.map(async (c) => {
                            // take another user id in array id
                            let receiverID = c.users.find(id => (id != user.id)) ?? user.id;

                            // call api django get another user info
                            let u = await authApis().get(endpoints['info_user'](receiverID));
                            let receiverUser = u.data;

                            c.updateAt = c.updateAt?.toDate();
                            return {
                                ...c,
                                receiverUser,
                            };
                        }))
                        // set conversations
                        setConversations(fullConvs);
                    } catch (ex) {
                        console.error(ex);
                    } finally {
                        setLoading(false);
                    }
                });

                return () => unsub();
            }
        } catch (ex) {
            console.error("Lỗi load chat", ex);
        }
    }, [user])


    useEffect(() => {
        if (!chatId) return;

        console.log(chatId);
        // const el = document.querySelector('.scroll-chat-here');
        // if (el) {
        //     el.scrollIntoView({ behavior: 'smooth' });
        // }

        const unsub = subscribeToMsg(chatId, (msgs) => {
            setMessages(msgs);
            // setLoading(false); // loading = false when load the first msg
        });

        return () => unsub();
    }, [chatId])


    useEffect(() => {
        if (locationReceiverUser && locatioSenderId) {
            setReceiverUser(locationReceiverUser);
            setChatId(getChatId(locationReceiverUser.id, locatioSenderId))
        }
    }, [locationReceiverUser, locatioSenderId]);


    if (!Array.isArray(conversations) || loading) {
        return <div className='d-flex justify-content-center mt-5'>
            <Spinner variant='success' size='lg' />
        </div>;
    }

    return (
        <Container className="h-100 p-0">
            <Row className="h-100 g-0">
                <Col md={4} lg={3} className="d-none d-md-block">
                    <div style={{ height: '90vh' }}>
                        <ConversationsBar
                            conversations={conversations}
                            chatId={chatId}
                            setChatId={setChatId}
                            setReceiverUser={setReceiverUser}
                        />
                    </div>
                </Col>

                <Col md={8} lg={9}>
                    <div style={{ height: '90vh', backgroundColor: 'white' }}>
                        <ChatScreen
                            receiverUser={receiverUser}
                            messages={messages}
                            myId={userId}
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Chat;