import './styles.css'
import { FunctionComponent, useState } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'
import MuxPlayer from '@mux/mux-player-react';

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
    <div className="container">
      <label className="label" htmlFor="video-url">Video URL</label>
      <input
        id="video-url"
        className="input"
        type="text"
        value={data.content || ''}
        onChange={handleChange}
        placeholder="Enter Video URL (.m3u8 / .mp4)"
      />
      {error && <p className="error-message">{error}</p>}
      {isValid && (
        <MuxPlayer 
          playbackId={isMuxPlaybackId ? data.content : undefined}
          src={isDirectUrl ? data.content : undefined}
        />
      )}
    </div>
  )
}

export default FieldPlugin
