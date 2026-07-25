"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PlayerTabsShell({
  defaultTab = "apercu",
  overview,
  stats,
  technical,
  videos,
  photos,
}: {
  defaultTab?: string;
  overview: React.ReactNode;
  stats: React.ReactNode;
  technical: React.ReactNode;
  videos: React.ReactNode;
  photos: React.ReactNode;
}) {
  return (
    <Tabs defaultValue={defaultTab} className="gap-8">
      <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
        <TabsTrigger value="apercu">Aperçu</TabsTrigger>
        <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        <TabsTrigger value="fiche-technique">Fiche technique</TabsTrigger>
        <TabsTrigger value="videos">Vidéos</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
      </TabsList>
      <TabsContent value="apercu">{overview}</TabsContent>
      <TabsContent value="statistiques">{stats}</TabsContent>
      <TabsContent value="fiche-technique">{technical}</TabsContent>
      <TabsContent value="videos">{videos}</TabsContent>
      <TabsContent value="photos">{photos}</TabsContent>
    </Tabs>
  );
}
