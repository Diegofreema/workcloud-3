import { StreamClientProvider } from '@/lib/stream';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const VideoLayout = () => {
  return (
    <>
      <StatusBar style="dark" />
      <StreamClientProvider>
        <Stack />
      </StreamClientProvider>
    </>
  );
};

export default VideoLayout;
