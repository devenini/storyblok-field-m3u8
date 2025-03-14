import './styles.css'
import { FunctionComponent, useState } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'
import MuxPlayer from '@mux/mux-player-react'
import { lightTheme } from '@storyblok/mui'
import {
    CssBaseline,
    ThemeProvider,
    TextField,
} from '@mui/material'

type Provider = 'mux' | 'direct' | 'vimeo';

type VideoContent = {
    provider: Provider | null;
    src: string;
};

const detectProvider = (value: string): VideoContent | null => {
    if (/^(https?:\/\/stream\.mux\.com\/)?[a-zA-Z0-9_-]+(\.m3u8)?$/.test(value)) {
        return { provider: 'mux', src: value };
    }
    if (/^https?:\/\/player\.vimeo\.com\/external\/\d+\.m3u8(\?.*)?$/.test(value)) {
        return { provider: 'vimeo', src: value };
    }
    if (/^https?:\/\/[\w./?=&-]+$/.test(value) && (value.endsWith('.m3u8') || value.endsWith('.mp4'))) {
        return { provider: 'direct', src: value };
    }
    return null;
};

const FieldPlugin: FunctionComponent = () => {
    const { type, data, actions } = useFieldPlugin({
        validateContent: (content: unknown) => ({
            content: typeof content === 'object' && content !== null ? content : { src: '', provider: null },
        }),
    });
    
    const [error, setError] = useState<string | null>(null);
    
    if (type !== 'loaded') {
        return null;
    }
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim();
        const detected = detectProvider(value);
        
        // Only set the content if there's a valid provider
        if (detected) {
            actions.setContent(detected);
            setError(null);
        } else {
            actions.setContent({ src: value, provider: null });
            setError(value === '' ? 'This field cannot be empty' : 'Invalid format. Enter a valid .m3u8 / .mp4 URL.');
        }
    };
    
    const { src, provider } = (data.content as VideoContent) || { src: '', provider: null };
    const isValid = provider !== null;

    let player = null;
    if (isValid && provider !== null) {
        player = <MuxPlayer src={src} className="player" />;
    }

    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <TextField 
                id="video-url"
                value={src || ''}
                onChange={handleChange}
                placeholder="Enter Video URL (.m3u8 / .mp4)"
                label="Video URL"
                size="small"
                error={!!error}
                helperText={error ?? 'Enter a valid .m3u8 / .mp4 URL'}
                fullWidth
            />
            {player}
        </ThemeProvider>
    );
};

export default FieldPlugin;
