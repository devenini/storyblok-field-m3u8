import './styles.css'
import { FunctionComponent, useState } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'
import MuxPlayer from '@mux/mux-player-react'
import { lightTheme } from '@storyblok/mui'
import {
  CssBaseline,
  ThemeProvider,
  TextField,
  Box
} from '@mui/material'

// test url: https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe.m3u8

const FieldPlugin: FunctionComponent = () => {
  const { type, data, actions } = useFieldPlugin({
    validateContent: (content: unknown) => ({
      content: typeof content === 'string' ? content : '',
    }),
  })

  const [error, setError] = useState<string | null>(null)

  if (type !== 'loaded') {
    return null
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
    actions.setContent(value)

    // Validation rules
    const isMuxPlaybackId = /^[a-zA-Z0-9_-]+$/.test(value)
    const isDirectUrl = /^https?:\/\/[\w./?=&-]+$/.test(value) && (value.endsWith('.m3u8') || value.endsWith('.mp4'))

    if (value === '' || isMuxPlaybackId || isDirectUrl) {
      setError(null)
    } else {
      setError('Invalid format. Enter a valid .m3u8 / .mp4 URL.')
    }
  }

  // Determine if content is valid
  const isMuxPlaybackId = /^[a-zA-Z0-9_-]+$/.test(data.content)
  const isDirectUrl = /^https?:\/\/[\w./?=&-]+$/.test(data.content) && (data.content.endsWith('.m3u8') || data.content.endsWith('.mp4'))
  const isValid = isMuxPlaybackId || isDirectUrl

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField 
          id="video-url"
          value={data.content || ''}
          onChange={handleChange}
          placeholder="Enter Video URL (.m3u8 / .mp4)"
          label="Video URL"
          size="small"
          error={!!error}
          helperText={error || 'Enter a valid .m3u8 / .mp4 URL or Mux Playback ID'}
          fullWidth
        />
        {isValid && (
          <MuxPlayer 
            playbackId={isMuxPlaybackId ? data.content : undefined}
            src={isDirectUrl ? data.content : undefined}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}

export default FieldPlugin
