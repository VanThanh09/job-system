import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import html2pdf from "html2pdf.js";
import { CV1, CV2, CV3, CV4, CV5, CV6, CV7, CV8 } from "./cv_templates/index";
import { Container } from "react-bootstrap";

/* ─── CV templates ─── */
const CV_TEMPLATES = [
    { id: "cv1", label: "Template 1 – CNTT", thumbnail: "🟢", getHtml: () => CV1 },
    { id: "cv2", label: "Template 2 – Hành chính", thumbnail: "⬜", getHtml: () => CV2 },
    { id: "cv3", label: "Template 3 – Thiết kế", thumbnail: "🔵", getHtml: () => CV3 },
    { id: "cv4", label: "Template 4 – Marketing", thumbnail: "🍂", getHtml: () => CV4 },
    { id: "cv5", label: "Template 5 – Hệ thống", thumbnail: "🖤", getHtml: () => CV5 },
    { id: "cv6", label: "Template 6 – Cơ khí", thumbnail: "⚙️", getHtml: () => CV6 },
    { id: "cv7", label: "Template 7 – Hoá học", thumbnail: "🧪", getHtml: () => CV7 },
    { id: "cv8", label: "Template 8 – Công nghiệp", thumbnail: "🏭", getHtml: () => CV8 },
];

export default function CVBuilder() {
    const editorRef = useRef(null);
    const gjsRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);
    const [activeTemplate, setActiveTemplate] = useState("cv1");
    const [showTemplates, setShowTemplates] = useState(false);

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        if (!editorRef.current || gjsRef.current) return;

        const editor = grapesjs.init({
            container: editorRef.current,
            height: "100%",
            fromElement: false,
            storageManager: false,

            // Ẩn toàn bộ panels mặc định
            panels: { defaults: [] },

            // Tắt block manager
            blockManager: false,

            // Tắt layer + style manager
            layerManager: false,
            styleManager: false,

            // Tắt device manager
            deviceManager: false,

            // ── Tắt hoàn toàn drag-and-drop ──
            // dragMode: false  →  tắt absolute drag
            // canvas.scripts → không inject script
            dragMode: false,
            canvas: {
                scripts: [],
                styles: [],
            },
        });

        const tpl = CV_TEMPLATES.find(t => t.id === activeTemplate);
        editor.setComponents(tpl ? tpl.getHtml() : CV1);

        // Căn giữa: style thẳng lên wrapper component của GrapesJS
        editor.on("load", () => {
            try {
                // 1. Style GrapesJS wrapper component (div bao ngoài cùng)
                const wrapper = editor.getWrapper();
                if (wrapper) {
                    wrapper.setStyle({
                        "display": "flex",
                        "flex-direction": "column",
                        "align-items": "center",
                        "background": "#ffffff",
                        "min-height": "100vh",
                        "padding": "0",
                        "margin": "0",
                    });
                }

                // 2. Inject CSS vào iframe để đảm bảo body không thêm khoảng trắng
                const doc = editor.Canvas.getDocument();
                const style = doc.createElement("style");
                style.textContent = `
                    html {
                        background: #ffffff !important;
                    }
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                    }
                    * { box-sizing: border-box; }
                    [data-gjs-highlightable]:hover {
                        outline: none !important;
                        box-shadow: none !important;
                    }
                `;
                doc.head.appendChild(style);
            } catch (e) {
                // no-op
            }
        });


        gjsRef.current = editor;

        return () => {
            try { editor.destroy(); } catch (e) { }
            gjsRef.current = null;
        };
    }, [activeTemplate]); // re-init when template changes

    /* ── Tạo HTML tự đứng (không có Bootstrap/oklch) ── */
    const buildStandaloneHtml = (editor) => {
        const css = editor.getCss();
        const html = editor.getHtml();
        return `<!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8"/>
                <style>
                *{box-sizing:border-box}
                body{margin:0;padding:0;background:#fff}

                @media print {
                    @page { size: A4; margin: 0; }
                    body  { margin: 0; padding: 0; }

                    /* Xoá margin/shadow trên tất cả CV container */
                    body > * {
                    margin-top:    0 !important;
                    margin-bottom: 0 !important;
                    box-shadow:    none !important;
                    }
                    /* Loại bỏ khoảng cách giữa các trang CV (nếu nhiều trang) */
                    body > * + * {
                    margin-top: 0 !important;
                    }
                }

                ${css}
                </style>
                </head>
                <body>${html}</body>
                </html>`;
    };


    /* ── Tải PDF về máy (dùng print – không cần html2canvas, không oklch) ── */
    const handleDownloadPDF = () => {
        const editor = gjsRef.current;
        if (!editor) return;

        // Mở cửa sổ sạch hoàn toàn – không Bootstrap, không oklch
        const win = window.open("", "_blank", "width=900,height=700");
        if (!win) {
            showToast("error", "Popup bị chặn. Hãy cho phép popup và thử lại.");
            return;
        }
        win.document.write(buildStandaloneHtml(editor));
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); win.close(); }, 600);
        showToast("success", "🖨  Chọn 'Save as PDF' trong hộp thoại in.");
    };

    return (
        <Container>
            <div style={s.page}>
                {/* Header */}
                <div style={s.header}>
                    <div style={s.headerLeft}>
                        {/* <span style={s.headerIcon}>📄</span> */}
                        <div>
                            {/* <h1 style={s.title}>THIẾT KẾ CV</h1>
                            <p style={s.subtitle}>Click vào chữ để thay đổi</p> */}
                        </div>
                    </div>
                    <div style={s.actions}>
                        {/* Template picker button */}
                        <div style={{ position: "relative" }}>
                            <button
                                id="btn-choose-template"
                                onClick={() => setShowTemplates(v => !v)}
                                style={{ ...s.btn, ...s.btnOutline }}
                            >
                                🎨 Chọn Template
                            </button>
                            {showTemplates && (
                                <div style={s.templateDropdown}>
                                    {CV_TEMPLATES.map(tpl => (
                                        <div
                                            key={tpl.id}
                                            id={`template-${tpl.id}`}
                                            onClick={() => {
                                                setActiveTemplate(tpl.id);
                                                setShowTemplates(false);
                                            }}
                                            style={{
                                                ...s.templateItem,
                                                background: activeTemplate === tpl.id ? "#d1fae5" : "#fff",
                                                fontWeight: activeTemplate === tpl.id ? 700 : 400,
                                            }}
                                        >
                                            <span style={{ fontSize: 18 }}>{tpl.thumbnail}</span>
                                            <span style={{ fontSize: 13 }}>{tpl.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            id="btn-download-cv"
                            onClick={handleDownloadPDF}
                            disabled={uploading}
                            style={{ ...s.btn, ...s.btnOutline }}
                        >
                            ⬇ Tải xuống PDF
                        </button>
                    </div>
                </div>

                {/* Canvas only – no side panels */}
                <div style={{ ...s.canvasArea, display: "flex" }} >
                    <div id="blocks" style={{ width: "200px" }}></div>
                    <div ref={editorRef} style={s.canvas} />
                </div>

                {/* Toast */}
                {toast && (
                    <div style={{
                        ...s.toast,
                        background: toast.type === "success" ? "#0b8826" : "#dc2626",
                    }}>
                        {toast.type === "success" ? "✓" : "✕"} {toast.msg}
                    </div>
                )}
            </div>
        </Container>
    );
}

const s = {
    page: {
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 60px)",
        background: "#ffffff",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        overflow: "hidden",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "15px",
        paddingBottom: "5px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        zIndex: 10,
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },
    headerIcon: {
        fontSize: 28,
    },
    title: {
        margin: 0,
        fontSize: 18,
        fontWeight: 700,
        marginTop: "5px",
        // color: "#0b8826",
    },
    subtitle: {
        margin: 0,
        fontSize: 12,
        color: "#9ca3af",
    },
    actions: {
        display: "flex",
        gap: 10,
    },
    btn: {
        border: "none",
        borderRadius: 8,
        padding: "8px 18px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "opacity .2s",
    },
    btnOutline: {
        background: "#f3f4f6",
        color: "#374151",
        border: "1px solid #d1d5db",
    },
    btnGreen: {
        background: "#0b8826",
        color: "#fff",
        boxShadow: "0 2px 8px rgba(11,136,38,0.3)",
    },
    canvasArea: {
        flex: 1,
        overflow: "hidden",
        background: "#ffffff",
    },
    templateDropdown: {
        position: "absolute",
        top: "calc(100% + 6px)",
        right: 0,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        zIndex: 200,
        minWidth: 240,
        overflow: "hidden",
    },
    templateItem: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        cursor: "pointer",
        borderBottom: "1px solid #f3f4f6",
        transition: "background .15s",
    },
    canvas: {
        width: "100%",
        height: "100%",
        flex: 1,
    },
    toast: {
        position: "fixed",
        bottom: 24,
        right: 24,
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: 14,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        zIndex: 9999,
        animation: "slideIn .25s ease",
    },
};