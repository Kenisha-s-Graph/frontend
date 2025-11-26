export const features = [
  {
    id: 1,
    title: 'Pencarian Entitas',
    description: 'Cari tokoh, peristiwa, atau entitas sejarah lain secara cepat melalui kolom pencarian.',
    icon: 'lucide:search',
    available: false,
    route: '/search'
  },
  {
    id: 2,
    title: 'Editor Query Cypher',
    description: 'Tulis dan jalankan query Cypher langsung ke Knowledge Graph untuk eksplorasi data sejarah secara mendalam.',
    icon: 'lucide:code',
    available: true,
    route: '/cypher'
  },
  {
    id: 3,
    title: 'Info Box Entitas',
    description: 'Lihat detail lengkap dan atribut penting dari entitas yang dipilih dalam tampilan info box yang ringkas.',
    icon: 'lucide:info',
    available: false,
    route: '/infobox'
  }
]