'use client';

// ─────────────────────────────────────────────────────────────
//  MessageBubble – Individual Chat Message Component
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import ReplyIcon from '@mui/icons-material/Reply';
import EmojiPicker, { Theme as EmojiTheme, EmojiClickData } from 'emoji-picker-react';
import { mediaUrl } from '@/api/endpoints';
import { decryptMessage } from '@/lib/utils/encryption';
import type { ChatMessage, ChatUser } from '@/typescript/types/chat.types';
import {
  MessageRow,
  BubbleContent,
  MessageHoverActions,
  ImageWrapper,
  FileMessageContainer,
  AudioContainer,
  ReplyContainer,
  ReactionChip,
} from '@/components/ui';

// ── Props ────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  onReply?: (message: ChatMessage) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onDelete?: (messageId: string) => void;
  onEdit?: (message: ChatMessage) => void;
}

// ── Helpers ──────────────────────────────────────────────────

function getSenderName(sender?: ChatUser | string): string {
  if (!sender || typeof sender === 'string') return '';
  return sender.name ?? '';
}

function getSenderAvatar(sender?: ChatUser | string): string | undefined {
  if (!sender || typeof sender === 'string') return undefined;
  const avatar = sender.avatar ?? sender.profile_image;
  return avatar ? (avatar.startsWith('http') ? avatar : mediaUrl(avatar)) : undefined;
}

function getReplyPreview(message: ChatMessage): string {
  if (message.type !== 'text') return `📎 ${message.type}`;
  return decryptMessage(message.content);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isImageUrl(url: string): boolean {
  return /\.(png|jpe?g|gif|webp|svg|bmp)(\?.*)?$/i.test(url);
}

function getMediaSrc(url: string): string {
  if (!url) return '';
  return url.startsWith('http') ? url : mediaUrl(url);
}

// ── Media Renderers ──────────────────────────────────────────

function ImageMessage({ url }: { url: string }) {
  const src = getMediaSrc(url);
  return <ImageWrapper src={src} alt="shared image" onClick={() => window.open(src, '_blank')} />;
}

function FileMessage({ url, name }: { url: string; name?: string }) {
  const src = getMediaSrc(url);
  const filename = name ?? url.split('/').pop() ?? 'file';
  return (
    <FileMessageContainer href={src} target="_blank" rel="noreferrer">
      <InsertDriveFileRoundedIcon sx={{ color: 'primary.light', fontSize: 28 }} />
      <Box>
        <Typography variant="body2" noWrap sx={{ maxWidth: 180, fontWeight: 500 }}>
          {filename}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
          Click to open
        </Typography>
      </Box>
    </FileMessageContainer>
  );
}

function AudioMessage({ url }: { url: string }) {
  const src = getMediaSrc(url);
  return (
    <AudioContainer>
      <audio controls preload="metadata" style={{ height: 32 }}>
        <source src={src} type="audio/webm;codecs=opus" />
        <source src={src} type="audio/webm" />
        <source src={src} type="audio/ogg" />
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </AudioContainer>
  );
}

// ── MessageBubble ────────────────────────────────────────────

export default function MessageBubble({
  message,
  isOwn,
  onReply,
  onReact,
  onDelete,
  onEdit,
}: MessageBubbleProps) {
  const [hovered, setHovered] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);

  if (message.isDeleted) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', mb: 1, px: 3 }}
      >
        <Box
          sx={{
            p: '8px 16px',
            borderRadius: 3,
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(138, 141, 163, 0.2)',
          }}
        >
          <Typography variant="caption" color="text.disabled" fontStyle="italic">
            This message was deleted
          </Typography>
        </Box>
      </Box>
    );
  }

  const senderName = getSenderName(message.sender);
  const senderAvatar = getSenderAvatar(message.sender);
  const repliedMsg =
    message.repliedTo && typeof message.repliedTo !== 'string'
      ? (message.repliedTo as ChatMessage)
      : null;

  const renderBody = () => {
    switch (message.type) {
      case 'image':
        return isImageUrl(message.content) ? (
          <ImageMessage url={message.content} />
        ) : (
          <FileMessage url={message.content} />
        );
      case 'file':
        return <FileMessage url={message.content} />;
      case 'audio':
        return <AudioMessage url={message.content} />;
      case 'video':
        return (
          <Box
            component="video"
            controls
            src={getMediaSrc(message.content)}
            sx={{ maxWidth: 260, borderRadius: 2, display: 'block' }}
          />
        );
      default:
        return (
          <Typography variant="body2" sx={{ lineHeight: 1.55, wordBreak: 'break-word' }}>
            {message.content}
          </Typography>
        );
    }
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setEmojiAnchorEl(null);
    onReact?.(message._id, emojiData.emoji);
  };

  const reactionGroups = message.reactions.reduce<Record<string, number>>((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <MessageRow
      isOwn={isOwn}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!isOwn && (
        <Avatar
          src={senderAvatar}
          sx={{
            width: 32,
            height: 32,
            mt: 'auto',
            mb: 0.5,
            fontSize: '0.8rem',
            background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
            border: '2px solid rgba(108, 92, 231, 0.2)',
            flexShrink: 0,
          }}
        >
          {senderName[0]}
        </Avatar>
      )}

      <Box
        sx={{
          position: 'relative',
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwn ? 'flex-end' : 'flex-start',
        }}
      >
        <MessageHoverActions isVisible={hovered} isOwn={isOwn}>
          <Tooltip title="React">
            <IconButton
              size="small"
              sx={{ color: 'white' }}
              onClick={(e) => setEmojiAnchorEl(e.currentTarget)}
            >
              <EmojiEmotionsRoundedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reply">
            <IconButton size="small" sx={{ color: 'white' }} onClick={() => onReply?.(message)}>
              <ReplyRoundedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          {isOwn && message.type === 'text' && (
            <Tooltip title="Edit">
              <IconButton size="small" sx={{ color: 'white' }} onClick={() => onEdit?.(message)}>
                <EditRoundedIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="More">
            <IconButton
              size="small"
              sx={{ color: 'white' }}
              onClick={(e) => setMenuAnchorEl(e.currentTarget)}
            >
              <MoreHorizRoundedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </MessageHoverActions>

        <Popover
          open={Boolean(emojiAnchorEl)}
          anchorEl={emojiAnchorEl}
          onClose={() => setEmojiAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: isOwn ? 'right' : 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: isOwn ? 'right' : 'left' }}
        >
          <EmojiPicker
            theme={EmojiTheme.DARK}
            onEmojiClick={handleEmojiSelect}
            lazyLoadEmojis
            reactionsDefaultOpen
          />
        </Popover>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={() => setMenuAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: isOwn ? 'right' : 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: isOwn ? 'right' : 'left' }}
          PaperProps={{
            sx: {
              background: 'rgba(18,21,42,0.97)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 2,
              backdropFilter: 'blur(12px)',
              minWidth: 140,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setMenuAnchorEl(null);
              onReply?.(message);
            }}
            sx={{ gap: 1.5, fontSize: '0.85rem', py: 1 }}
          >
            <ReplyIcon fontSize="small" sx={{ color: 'text.secondary' }} /> Reply
          </MenuItem>
          {isOwn && (
            <MenuItem
              onClick={() => {
                setMenuAnchorEl(null);
                onDelete?.(message._id);
              }}
              sx={{ gap: 1.5, fontSize: '0.85rem', py: 1, color: '#FF7675' }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" /> Delete
            </MenuItem>
          )}
        </Menu>

        {repliedMsg && (
          <ReplyContainer>
            <Typography
              variant="caption"
              sx={{ color: 'primary.light', fontWeight: 600, display: 'block' }}
            >
              {getSenderName(repliedMsg.sender) || 'Message'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 220,
              }}
            >
              {getReplyPreview(repliedMsg)}
            </Typography>
          </ReplyContainer>
        )}

        <BubbleContent isOwn={isOwn} sx={{ maxWidth: '100%' }}>
          {renderBody()}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 0.5,
              mt: message.type !== 'text' ? 0.5 : 0.3,
            }}
          >
            {message.isEdited && (
              <Typography
                variant="caption"
                sx={{ color: 'text.disabled', fontSize: '0.6rem', fontStyle: 'italic' }}
              >
                edited
              </Typography>
            )}
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
              {formatTime(message.createdAt)}
            </Typography>
            {isOwn && <DoneAllRoundedIcon sx={{ fontSize: 14, color: '#6C5CE7' }} />}
          </Box>
        </BubbleContent>

        {Object.keys(reactionGroups).length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              mt: 0.5,
              justifyContent: isOwn ? 'flex-end' : 'flex-start',
            }}
          >
            {Object.entries(reactionGroups).map(([emoji, count]) => (
              <ReactionChip key={emoji} onClick={() => onReact?.(message._id, emoji)}>
                {emoji}{' '}
                {count > 1 && (
                  <span style={{ color: '#A29BFE', fontSize: '0.65rem' }}>{count}</span>
                )}
              </ReactionChip>
            ))}
          </Box>
        )}
      </Box>

      {isOwn && (
        <Avatar
          src={senderAvatar}
          sx={{
            width: 32,
            height: 32,
            mt: 'auto',
            mb: 0.5,
            fontSize: '0.8rem',
            background: 'linear-gradient(135deg, #00CEC9, #55EFC4)',
            border: '2px solid rgba(0, 206, 201, 0.2)',
            flexShrink: 0,
          }}
        >
          {senderName[0]}
        </Avatar>
      )}
    </MessageRow>
  );
}
