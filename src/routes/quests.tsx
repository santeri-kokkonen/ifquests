import { createFileRoute } from '@tanstack/react-router';
import { AppShell } from '@/components/AppShell';
import { QuestBoard } from '@/components/QuestBoard';
import { pageHead } from '@/lib/page-head';
export const Route=createFileRoute('/quests')({head:()=>pageHead('Your move quests','Make your rental move safer with a room-by-room checklist, evidence and crew support.'),component:()=> <AppShell><QuestBoard/></AppShell>});