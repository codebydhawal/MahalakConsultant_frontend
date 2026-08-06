import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Extension } from "@tiptap/core";

import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
} from "@mui/material";

import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Undo,
  Redo,
} from "@mui/icons-material";

interface ProjectEditorProps {
  html: string;
  json: any;
  onChange: (html: string, json: any) => void;
}

const FontSize = Extension.create({
  name: "fontSize",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize || null,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
          ({ chain }) => {
            return chain()
              .setMark("textStyle", { fontSize })
              .run();
          },

      unsetFontSize:
        () =>
          ({ chain }) => {
            return chain()
              .setMark("textStyle", { fontSize: null })
              .run();
          },
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export default function ProjectEditor({
  html,
  json,
  onChange,
}: ProjectEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Link,
      Image,
      TextStyle,
      Color,
      FontSize, // 👈 Add this line
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: html,

    immediatelyRender: false,

    onUpdate({ editor }) {
      onChange(editor.getHTML(), editor.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== html) {
      editor.commands.setContent(html);
    }
  }, [html, editor]);

  if (!editor) return null;

  const getHeadingValue = () => {
    if (editor.isActive("heading", { level: 1 })) return "1";
    if (editor.isActive("heading", { level: 2 })) return "2";
    if (editor.isActive("heading", { level: 3 })) return "3";
    return "paragraph";
  };

  const handleHeadingChange = (event: SelectChangeEvent) => {
    const value = event.target.value;

    editor.chain().focus();

    switch (value) {
      case "1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;

      case "2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;

      case "3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;

      default:
        editor.chain().focus().setParagraph().run();
    }
  };

  const handleColorChange = (event: SelectChangeEvent) => {
    editor.chain().focus().setColor(event.target.value).run();
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          p: 1,
          bgcolor: "#f5f5f5",
          flexWrap: "wrap",
        }}
      >

        <FormControl
          size="small"
          sx={{
            minWidth: 150,
            bgcolor: "white",
          }}
        >
          <Select
            value={getHeadingValue()}
            onChange={handleHeadingChange}
          >
            <MenuItem value="paragraph">Paragraph</MenuItem>
            <MenuItem value="1">Heading 1</MenuItem>
            <MenuItem value="2">Heading 2</MenuItem>
            <MenuItem value="3">Heading 3</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{
            minWidth: 130,
            bgcolor: "white",
          }}
        >
          <InputLabel>Color</InputLabel>

          <Select
            label="Color"
            defaultValue="#000000"
            onChange={handleColorChange}
          >
            <MenuItem value="#000000">Black</MenuItem>

            <MenuItem value="#d32f2f">Red</MenuItem>

            <MenuItem value="#1976d2">Blue</MenuItem>

            <MenuItem value="#388e3c">Green</MenuItem>

            <MenuItem value="#f57c00">Orange</MenuItem>

            <MenuItem value="#7b1fa2">Purple</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Size</InputLabel>

          <Select
            label="Size"
            defaultValue="16px"
            onChange={(e) =>
              editor.chain().focus().setFontSize(e.target.value).run()
            }
          >
            <MenuItem value="12px">12</MenuItem>
            <MenuItem value="14px">14</MenuItem>
            <MenuItem value="16px">16</MenuItem>
            <MenuItem value="18px">18</MenuItem>
            <MenuItem value="20px">20</MenuItem>
            <MenuItem value="24px">24</MenuItem>
            <MenuItem value="32px">32</MenuItem>
          </Select>
        </FormControl>

        <Tooltip title="Bold">
          <IconButton
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
            color={editor.isActive("bold") ? "primary" : "default"}
          >
            <FormatBold />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
            color={editor.isActive("italic") ? "primary" : "default"}
          >
            <FormatItalic />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton
            onClick={() =>
              editor.chain().focus().toggleUnderline().run()
            }
            color={editor.isActive("underline") ? "primary" : "default"}
          >
            <FormatUnderlined />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="Bullet List">
          <IconButton
            onClick={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            <FormatListBulleted />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List">
          <IconButton
            onClick={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            <FormatListNumbered />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="Align Left">
          <IconButton
            onClick={() =>
              editor.chain().focus().setTextAlign("left").run()
            }
          >
            <FormatAlignLeft />
          </IconButton>
        </Tooltip>

        <Tooltip title="Align Center">
          <IconButton
            onClick={() =>
              editor.chain().focus().setTextAlign("center").run()
            }
          >
            <FormatAlignCenter />
          </IconButton>
        </Tooltip>

        <Tooltip title="Align Right">
          <IconButton
            onClick={() =>
              editor.chain().focus().setTextAlign("right").run()
            }
          >
            <FormatAlignRight />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="Undo">
          <IconButton
            onClick={() =>
              editor.chain().focus().undo().run()
            }
          >
            <Undo />
          </IconButton>
        </Tooltip>

        <Tooltip title="Redo">
          <IconButton
            onClick={() =>
              editor.chain().focus().redo().run()
            }
          >
            <Redo />
          </IconButton>
        </Tooltip>
      </Stack>

      <Divider />

      <Box
        sx={{
          minHeight: 400,
          p: 3,
          "& .ProseMirror": {
            outline: "none",
            minHeight: 350,
            fontSize: 16,
            lineHeight: 1.8,
          },
          "& .ProseMirror p": {
            margin: "10px 0",
          },
          "& .ProseMirror ul": {
            paddingLeft: "20px",
          },
          "& .ProseMirror ol": {
            paddingLeft: "20px",
          },
          "& .ProseMirror h1": {
            fontSize: "2rem",
            fontWeight: 700,
          },
          "& .ProseMirror h2": {
            fontSize: "1.6rem",
            fontWeight: 700,
          },
          "& .ProseMirror h3": {
            fontSize: "1.3rem",
            fontWeight: 700,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
}