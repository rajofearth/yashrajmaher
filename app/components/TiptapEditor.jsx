"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export default function TiptapEditor({ content, setContent, placeholder }) {
	const editor = useEditor({
		extensions: [StarterKit],
		content: content || "<p></p>",
		onUpdate({ editor }) {
			setContent(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: "prose prose-sm focus:outline-none",
				placeholder: placeholder || "Write something...",
			},
		},
	});

	useEffect(() => {
		return () => {
			if (editor) editor.destroy();
		};
	}, [editor]);

	if (!editor) return null;
	return <EditorContent editor={editor} />;
}
