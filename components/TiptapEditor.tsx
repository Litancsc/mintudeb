'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { useState } from 'react';
import { FaLink } from 'react-icons/fa';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const [showHTML, setShowHTML] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkURL, setLinkURL] = useState('');
  const [linkText, setLinkText] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    immediatelyRender:false,
    editorProps: {
      attributes: {
        class: 'outline-none w-full max-w-full', // Full-width and remove border outline
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const insertLink = () => {
    if (!linkURL || !linkText) return;
    editor.chain().focus().insertContent(`<a href="${linkURL}" target="_blank">${linkText}</a>`).run();
    setShowLinkModal(false);
    setLinkURL('');
    setLinkText('');
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2 items-center">
        {[1, 2, 3, 4, 5, 6].map(level => (
          <button
            key={level}
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
            }
            className={`px-2 py-1 border rounded ${
              editor.isActive('heading', { level: level as 1 | 2 | 3 | 4 | 5 | 6 }) ? 'bg-gray-300' : 'hover:bg-gray-200'
            }`}
          >
            H{level}
          </button>
        ))}

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 border rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 border rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 border rounded ${editor.isActive('underline') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        >
          U
        </button>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 border rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 border rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        >
          1. List
        </button>

        {/* Blockquote */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 border rounded ${editor.isActive('blockquote') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        >
          ❝
        </button>

        {/* Code */}
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-2 py-1 border rounded ${editor.isActive('code') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        >
          Code
        </button>

        {/* Text Alignment */}
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className="px-2 py-1 border rounded hover:bg-gray-200">Left</button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className="px-2 py-1 border rounded hover:bg-gray-200">Center</button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className="px-2 py-1 border rounded hover:bg-gray-200">Right</button>

        {/* Image */}
        <button
          onClick={() => {
            const url = prompt('Enter image URL');
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="px-2 py-1 border rounded hover:bg-gray-200"
        >
          Img
        </button>

        {/* Link Modal */}
        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          className="px-2 py-1 border rounded hover:bg-gray-200 flex items-center gap-1"
        >
          <FaLink /> Link
        </button>

        {/* HTML View Toggle */}
        <button
          type="button"
          onClick={() => setShowHTML(!showHTML)}
          className="ml-auto px-2 py-1 border rounded hover:bg-gray-200 text-sm"
        >
          {showHTML ? 'Editor View' : 'HTML View'}
        </button>
      </div>

      {/* Editor / HTML */}
      {showHTML ? (
        <textarea
          className="w-full h-64 p-2 border rounded font-mono text-sm"
          value={editor.getHTML()}
          onChange={(e) => editor.commands.setContent(e.target.value)}
        />
      ) : (
        <EditorContent editor={editor} className="border rounded p-2 min-h-[200px]" />
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">Insert Link</h3>
            <input
              type="text"
              placeholder="Link Text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="input-field mb-2 w-full"
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={linkURL}
              onChange={(e) => setLinkURL(e.target.value)}
              className="input-field mb-4 w-full"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-4 py-2 btn-primary"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiptapEditor;
