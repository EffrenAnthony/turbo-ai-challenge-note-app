interface NoteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Note #{id}</h1>
      <p className="text-gray-500">Note detail will load from API.</p>
    </div>
  )
}
