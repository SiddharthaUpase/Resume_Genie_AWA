import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CustomQuillEditor = ({ value, onChange, index }) => {
  const quillRef = useRef(null);

  const getCurrentSentence = () => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();
    if (range) {
      const [line] = quill.getLine(range.index);
      const lineText = line.text();
      
      // Find the start of the sentence
      let start = range.index;
      while (start > 0 && !/[.!?]/.test(lineText[start - 1])) {
        start--;
      }
      
      // Find the end of the sentence
      let end = range.index;
      while (end < lineText.length && !/[.!?]/.test(lineText[end])) {
        end++;
      }
      
      const sentence = lineText.slice(start, end + 1).trim();
      console.log("Current sentence:", sentence);
      return sentence;
    }
  };

  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        ['link'],
        [{ 'list': 'bullet' }],
        ['get-sentence']
      ],
      handlers: {
        'get-sentence': getCurrentSentence
      }
    }
  };

  useEffect(() => {
    if (quillRef.current) {
      const toolbar = quillRef.current.getEditor().getModule('toolbar');
      toolbar.addHandler('get-sentence', getCurrentSentence);
    }
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      className="bg-gray-50 rounded-lg"
    />
  );
};

export default CustomQuillEditor;