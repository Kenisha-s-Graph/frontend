import type { SearchSuggestion, SearchResponse } from '~/types/search';

export const useSearch = () => {
  // Dummy data untuk suggestion
  const dummySuggestions: SearchSuggestion[] = [
    { id: '1', name: 'Soekarno', type: 'person' },
    { id: '2', name: 'Mohammad Hatta', type: 'person' },
    { id: '3', name: 'Proklamasi Kemerdekaan', type: 'event' },
    { id: '4', name: 'Sumpah Pemuda', type: 'event' },
    { id: '5', name: 'Cut Nyak Dien', type: 'person' },
    { id: '6', name: 'Perang Diponegoro', type: 'event' },
    { id: '7', name: 'R.A. Kartini', type: 'person' },
    { id: '8', name: 'Konferensi Asia Afrika', type: 'event' }
  ];

  // Dummy data untuk hasil pencarian lengkap
  const dummySearchResults: SearchResponse = {
    status: 'success',
    results: {
      persons: [
        {
          id: '1',
          full_name: 'Soekarno',
          description: 'Presiden pertama Republik Indonesia yang memimpin Indonesia meraih kemerdekaan dari penjajahan Belanda. Beliau adalah proklamator kemerdekaan Indonesia bersama Mohammad Hatta.',
          image_url: 'https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,f_auto,q_auto:best,w_640/v1629103956/ruro8lifdnazz6rfnlhn.jpg',
          country: 'Indonesia',
          position: 'Presiden RI ke-1'
        },
        {
          id: '2',
          full_name: 'Mohammad Hatta',
          description: 'Wakil Presiden pertama Indonesia yang bersama Soekarno memproklamasikan kemerdekaan Indonesia. Dikenal sebagai Bapak Koperasi Indonesia.',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/VP_Hatta.jpg',
          country: 'Indonesia',
          position: 'Wakil Presiden RI ke-1'
        },
        {
          id: '5',
          full_name: 'Cut Nyak Dien',
          description: 'Pahlawan nasional Indonesia dari Aceh yang berjuang melawan penjajahan Belanda. Beliau adalah sosok perempuan tangguh yang memimpin perang gerilya.',
          image_url: 'https://i.pinimg.com/736x/a2/12/cb/a212cbb0a3e4a81030bbd9a9eea812ba.jpg',
          country: 'Indonesia',
          position: 'Pejuang Kemerdekaan'
        },
        {
          id: '7',
          full_name: 'Raden Ajeng Kartini',
          description: 'Pelopor kebangkitan perempuan pribumi di Indonesia. Beliau dikenal karena surat-suratnya yang memperjuangkan emansipasi wanita.',
          image_url: 'https://www.djkn.kemenkeu.go.id/files/images/2021/04/0541552COLLECTIE-TROPENMUSEUM-Gesigneerd-portret-van-Raden-Ajeng-Kartini-TMnr-10018775780x390.jpg',
          country: 'Indonesia',
          position: 'Tokoh Emansipasi Wanita'
        }
      ],
      events: [
        {
          id: '3',
          name: 'Proklamasi Kemerdekaan Indonesia',
          description: 'Peristiwa bersejarah pada tanggal 17 Agustus 1945 ketika Soekarno dan Hatta memproklamasikan kemerdekaan Indonesia dari penjajahan Belanda dan Jepang.',
          image_url: 'https://www.its.ac.id/news/wp-content/uploads/sites/2/2022/08/355212.jpg',
          country: 'Indonesia',
          impact: 'Kemerdekaan Indonesia'
        },
        {
          id: '4',
          name: 'Sumpah Pemuda',
          description: 'Ikrar dari para pemuda Indonesia pada tanggal 28 Oktober 1928 yang menyatakan satu tanah air, satu bangsa, dan satu bahasa yaitu Indonesia.',
          image_url: 'https://satpolpp.balikpapan.go.id/contents/20240805103624196766.jpg',
          country: 'Indonesia',
          impact: 'Persatuan Bangsa Indonesia'
        },
        {
          id: '6',
          name: 'Perang Diponegoro',
          description: 'Perang besar melawan penjajah Belanda yang dipimpin oleh Pangeran Diponegoro dari tahun 1825 hingga 1830 di Jawa.',
          image_url: 'https://cdn-web-2.ruangguru.com/landing-pages/assets/22698048-ae34-48fb-9219-26470479f926.jpg',
          country: 'Indonesia',
          impact: 'Perlawanan terhadap Kolonialisme'
        },
        {
          id: '8',
          name: 'Konferensi Asia Afrika',
          description: 'Konferensi internasional yang diselenggarakan di Bandung pada tahun 1955, menghadirkan negara-negara Asia dan Afrika untuk membahas kerja sama dan perdamaian dunia.',
          image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMehqnbaGXCO_cymp7yNhlpujwM6TtqURbzg&s',
          country: 'Indonesia',
          impact: 'Gerakan Non-Blok'
        }
      ]
    }
  };

  // Simulasi API call untuk suggestion dengan debounce
  const fetchSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query.trim()) return [];
    
    return dummySuggestions.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Simulasi API call untuk hasil pencarian lengkap
  const fetchSearchResults = async (query: string): Promise<SearchResponse> => {
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!query.trim()) {
      return { status: 'success', results: { persons: [], events: [] } };
    }

    // Filter hasil berdasarkan query
    const filteredPersons = dummySearchResults.results.persons.filter(person =>
      person.full_name.toLowerCase().includes(query.toLowerCase()) ||
      person.description.toLowerCase().includes(query.toLowerCase()) ||
      person.position.toLowerCase().includes(query.toLowerCase())
    );

    const filteredEvents = dummySearchResults.results.events.filter(event =>
      event.name.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.impact.toLowerCase().includes(query.toLowerCase())
    );

    return {
      status: 'success',
      results: {
        persons: filteredPersons,
        events: filteredEvents
      }
    };
  };

  return {
    fetchSuggestions,
    fetchSearchResults
  };
};