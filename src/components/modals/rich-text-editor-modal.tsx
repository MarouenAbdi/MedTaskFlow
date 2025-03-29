import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Toggle } from '@/components/ui/toggle';
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Pencil,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Highlighter,
  Palette,
  Save,
} from 'lucide-react';

interface RichTextEditorModalProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colors = [
  '#000000', '#343434', '#787878', '#9E9E9E', '#B4B4B4', '#FFFFFF',
  '#FF0000', '#FF4D00', '#FF9900', '#FFE600', '#7FFF00', '#00FF15',
  '#00FFB2', '#0099FF', '#0033FF', '#0000FF', '#4C00FF', '#9900FF',
  '#FF00FF', '#FF0066', '#800000', '#804D00', '#808000', '#408000',
  '#008080', '#004080', '#000080', '#400080', '#800080', '#800040',
];

export function RichTextEditorModal({ 
  content, 
  onChange, 
  title, 
  description,
  open,
  onOpenChange,
}: RichTextEditorModalProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [localContent, setLocalContent] = useState(content);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: localContent,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setLocalContent(newContent);
      setHasUnsavedChanges(true);
    },
    editorProps: {
      attributes: {
        class: 'min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm',
      },
    },
  });

  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Initialize editor content when modal opens
  useEffect(() => {
    if (open && editor) {
      editor.commands.setContent(content);
      setLocalContent(content);
      setHasUnsavedChanges(false);
    }
  }, [open, content, editor]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasUnsavedChanges) {
      setShowAlert(true);
    } else {
      onOpenChange(newOpen);
      if (newOpen) {
        // Reset state when opening
        setLocalContent(content);
        setHasUnsavedChanges(false);
      }
    }
  };

  const handleSave = () => {
    onChange(localContent);
    setHasUnsavedChanges(false);
    onOpenChange(false);
  };

  const handleDiscardChanges = () => {
    setShowAlert(false);
    onOpenChange(false);
    setHasUnsavedChanges(false);
    if (editor) {
      editor.commands.setContent(content);
    }
  };

  const setLink = () => {
    if (!linkUrl) {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    setLinkUrl('');
    setShowLinkInput(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-[800px] max-h-[90vh] overflow-hidden p-6">
          <DialogHeader className="mb-4">
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          
          <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-12rem)]">
            <div className="flex flex-wrap gap-1 items-center pb-4 border-b">
              <Toggle
                size="sm"
                pressed={editor?.isActive('bold')}
                onPressedChange={() => editor?.chain().focus().toggleBold().run()}
              >
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor?.isActive('italic')}
                onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
              >
                <Italic className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor?.isActive('underline')}
                onPressedChange={() => editor?.chain().focus().toggleUnderline().run()}
              >
                <UnderlineIcon className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor?.isActive('heading', { level: 2 })}
                onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                <Heading2 className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor?.isActive('bulletList')}
                onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
              >
                <List className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor?.isActive('orderedList')}
                onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>

              {/* Text Alignment */}
              <Toggle
                size="sm"
                pressed={editor?.isActive({ textAlign: 'left' })}
                onPressedChange={() => editor?.chain().focus().setTextAlign('left').run()}
              >
                <AlignLeft className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor?.isActive({ textAlign: 'center' })}
                onPressedChange={() => editor?.chain().focus().setTextAlign('center').run()}
              >
                <AlignCenter className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor?.isActive({ textAlign: 'right' })}
                onPressedChange={() => editor?.chain().focus().setTextAlign('right').run()}
              >
                <AlignRight className="h-4 w-4" />
              </Toggle>

              {/* Link */}
              <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={editor?.isActive('link') ? 'bg-accent' : ''}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="Enter URL"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                    />
                    <Button size="sm" onClick={setLink}>
                      Set Link
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Text Color */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Palette className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid grid-cols-6 gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-md border"
                        style={{ backgroundColor: color }}
                        onClick={() => editor?.chain().focus().setColor(color).run()}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Highlight */}
              <Toggle
                size="sm"
                pressed={editor?.isActive('highlight')}
                onPressedChange={() => editor?.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
              >
                <Highlighter className="h-4 w-4" />
              </Toggle>

              {/* Save Button */}
              <Button
                size="sm"
                className="ml-auto"
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>

            <div>
              <EditorContent editor={editor} />
            </div>
          </div>
          
          <DialogFooter className="mt-6 pt-4 border-t">
            <div className="flex items-center gap-4 w-full">
              <div className="text-sm text-muted-foreground mr-auto">
                {hasUnsavedChanges ? "You have unsaved changes" : "All changes saved"}
              </div>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to continue editing or discard your changes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Continue Editing
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardChanges}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}