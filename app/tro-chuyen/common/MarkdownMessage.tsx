import ReactMarkdown from "react-markdown";

const MarkdownMessage = ({ content }: { content: string }) => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
}

export default MarkdownMessage;