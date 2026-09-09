import AppLayout from '@/components/AppLayout';
import AssistantChat from '../components/AssistantChat';

export default function AssistantPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-4 lg:py-6 h-full">
        <AssistantChat />
      </div>
    </AppLayout>
  );
}
