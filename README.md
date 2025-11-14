# PDF Merger

A modern, user-friendly web application for merging PDF files with advanced preview and editing capabilities.

## Features

✨ **Upload Multiple PDFs**
- Drag & drop or click to select PDF files
- Support for multiple file uploads
- Visual file list with size information

👁️ **Preview Pages**
- See thumbnails of all pages from all uploaded PDFs
- Grid layout for easy viewing
- Page numbers and source file labels

✂️ **Delete Pages**
- Remove individual pages with a single click
- Select multiple pages for batch deletion
- Visual feedback for selected pages

🔄 **Reorder Pages**
- Drag and drop to rearrange pages
- Smooth animations and visual feedback
- Create your perfect document structure

💾 **Merge & Download**
- One-click merge and download
- Custom filename option
- Progress indicators during processing

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **pdf-lib** - PDF manipulation
- **pdfjs-dist** - PDF rendering for previews
- **@dnd-kit** - Drag and drop functionality

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Upload PDFs**: Click the upload area or drag and drop PDF files
2. **Preview**: All pages from all PDFs will be displayed as thumbnails
3. **Edit**:
   - Delete unwanted pages by clicking the trash icon
   - Select multiple pages using checkboxes for batch deletion
   - Drag pages to reorder them
4. **Merge**: Click "Merge & Download" to combine all pages into a single PDF
5. **Download**: Your merged PDF will automatically download

## Privacy & Security

🔒 **All processing happens in your browser**
- No files are uploaded to any server
- Your PDFs never leave your device
- Complete privacy and security

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### PDFs not loading
- Ensure your PDFs are not password-protected
- Check browser console for errors
- Try with a smaller PDF first

### Slow performance with large PDFs
- Large PDFs with many pages may take time to generate thumbnails
- Consider splitting very large PDFs before merging

### Download not working
- Check if pop-ups are blocked in your browser
- Ensure you have write permissions to the download folder

---

**Made with ❤️ using Next.js and modern web technologies**

