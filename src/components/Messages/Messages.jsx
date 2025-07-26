import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  Send, 
  Image, 
  Paperclip,
  X,
  Loader
} from 'lucide-react';
import { motion } from 'framer-motion';
// Import commented out for presentation mode
// import { useCreateMessageMutation, useGetMessagesByProjectQuery } from '../../services/api';

const Messages = ({ projectId, projectName }) => {
  const { user } = useSelector(state => state.auth);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [localMessages, setLocalMessages] = useState([]); // Local messages for presentation
  const [isLoading, setIsLoading] = useState(false); // Simple loading state for presentation
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // For presentation mode - don't actually make API calls
  // Uncomment these when you have a working backend
  // const [createMessage, { isLoading: sendingMessage }] = useCreateMessageMutation();
  // const { data: messages, isLoading: loadingMessages } = useGetMessagesByProjectQuery(projectId, { 
  //   pollingInterval: 10000 // Poll for new messages every 10 seconds
  // });
  
  // For presentation mode - use local state only
  const [sendingMessage, setSendingMessage] = useState(false);
  const messages = []; // No messages from the API during presentation
  const loadingMessages = false; // Skip loading state for presentation
  
  // Combine API messages with local messages for presentation
  const displayMessages = [...(messages || []), ...localMessages];

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, localMessages]);

  // Simplified message handling for presentation purposes
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((!message.trim() && attachments.length === 0) || sendingMessage) return;
    
    // Start loading state for presentation
    setSendingMessage(true);
    
    // For presentation purposes, create a simulated message locally
    const newMessage = {
      _id: `temp-${Date.now()}`,
      text: message,
      createdAt: new Date().toISOString(),
      sender: user || {
        _id: 'current-user',
        name: 'You',
        role: user?.role || 'client'
      },
      attachments: attachments.map(file => ({
        name: file.name,
        type: file.type,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '#'
      }))
    };
    
    // Add to local messages for immediate display
    setLocalMessages(prev => [...prev, newMessage]);
    
    // Reset form state
    setMessage('');
    setAttachments([]);
    setPreviewImages([]);
    
    // Just log for presentation purposes
    console.log('Message sent (presentation mode):', newMessage);
    
    // Simulate API delay for presentation mode
    setTimeout(() => {
      setSendingMessage(false);
    }, 500);
    
    /* When you're ready to connect to the backend, uncomment this section and comment out the code above
    
    try {
      const formData = new FormData();
      formData.append('text', message);
      formData.append('projectId', projectId);
      
      if (attachments.length > 0) {
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      await createMessage(formData).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
    */
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Add to attachments
    setAttachments(prev => [...prev, ...files]);
    
    // Create previews for images
    const imagePreviews = files
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
    
    setPreviewImages(prev => [...prev, ...imagePreviews]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    
    // Also remove image preview if it exists
    const previewToRemove = previewImages.find(preview => preview.file === attachments[index]);
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
      setPreviewImages(prev => prev.filter(preview => preview.file !== attachments[index]));
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + 
           date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Project Chat</h3>
        <p className="text-xs text-gray-500">Exchange messages with project participants</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {loadingMessages && displayMessages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <Loader className="animate-spin h-5 w-5 text-indigo-600" />
            <span className="ml-2 text-xs sm:text-sm text-gray-600">Loading messages...</span>
          </div>
        ) : displayMessages.length > 0 ? (
          <div className="space-y-3 sm:space-y-4" id="messages-container">
            {displayMessages.map(msg => (
              <motion.div 
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg p-2 sm:p-3 ${
                  msg.sender?._id === user?._id 
                    ? 'bg-indigo-50 text-gray-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-medium text-gray-700">
                      {msg.sender?.name} 
                      {msg.sender?.role === 'admin' && <span className="ml-1 text-indigo-600">(Admin)</span>}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTimestamp(msg.createdAt)}
                    </span>
                  </div>
                  
                  {msg.text && (
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                  )}
                  
                  {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.attachments.map((attachment, index) => (
                        <div key={index}>
                          {attachment.type?.startsWith('image/') ? (
                            <div className="mt-2">
                              <img 
                                src={attachment.url} 
                                alt="Attachment" 
                                className="max-h-48 rounded-md"
                              />
                            </div>
                          ) : (
                            <a 
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer" 
                              className="flex items-center text-xs text-indigo-600 hover:text-indigo-500"
                            >
                              <Paperclip className="h-3 w-3 mr-1" />
                              {attachment.name || 'Attachment'}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
      </div>
      
      {/* Image previews */}
      {previewImages.length > 0 && (
        <div className="px-3 sm:px-4">
          <div className="flex flex-wrap gap-2 mt-2 mb-1">
            {previewImages.map((preview, index) => (
              <div key={index} className="relative">
                <img 
                  src={preview.url} 
                  alt={`Preview ${index}`} 
                  className="h-16 w-16 object-cover rounded-md border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeAttachment(attachments.indexOf(preview.file))}
                  className="absolute -top-1 -right-1 bg-gray-800 rounded-full p-0.5 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Attachments list (non-images) */}
      {attachments.filter(file => !file.type.startsWith('image/')).length > 0 && (
        <div className="px-3 sm:px-4">
          <div className="flex flex-wrap gap-2 mt-2 mb-1">
            {attachments
              .filter(file => !file.type.startsWith('image/'))
              .map((file, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 rounded-md px-2 py-1 flex items-center text-xs"
                >
                  <Paperclip className="h-3 w-3 mr-1 text-gray-500" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(attachments.indexOf(file))}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-gray-200 mt-auto bg-white">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full border rounded-md pl-3 pr-24 py-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none shadow-sm"
            rows={2}
            disabled={sendingMessage}
          />
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none"
              disabled={sendingMessage}
            >
              <Image className="h-4 w-4 text-gray-600" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                disabled={sendingMessage}
              />
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md flex items-center ${sendingMessage
                ? 'bg-indigo-400 cursor-not-allowed'
                : (!message.trim() && attachments.length === 0)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none`}
              disabled={(!message.trim() && attachments.length === 0) || sendingMessage}
            >
              {sendingMessage ? (
                <><Loader className="h-4 w-4 text-white animate-spin mr-1" /> Sending...</>
              ) : (
                <><Send className="h-4 w-4 text-white mr-1" /> Send</>
              )}
            </button>
          </div>
        </div>
        {sendingMessage && (
          <p className="text-xs text-gray-500 mt-1">Sending message...</p>
        )}
      </form>
    </div>
  );
};

export default Messages;
