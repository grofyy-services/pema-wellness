type ImageItem = {
  title: string
  subtitle: string
  imageUrl: string
  locationUrl?: string
}

type DataItem = {
  id: number
  images: ImageItem[]
  hasFourImages: boolean
  tab: string
}

export const slidesData: DataItem[] = [
  {
    id: 1,
    tab: 'For the ocean lover',
    images: [
      {
        title: 'Rushikonda beach ',
        subtitle: 'golden sands, gentle waves, and sunrise walks',
        imageUrl: '/images/pema-lite/rushikonda-beach.webp',
        locationUrl:
          'https://www.google.com/maps/dir//Rushikonda+Beach,+Andhra+Pradesh/@17.7825975,83.3439156,13z/',
      },
      {
        title: 'Sunset coast drives ',
        subtitle: 'soft light, open roads, and sea-kissed air',
        imageUrl: '/images/pema-lite/sunset-coast.webp',
      },
      {
        title: 'RK Beach & Submarine Museum',
        subtitle: 'coastal promenades and naval history',
        imageUrl: '/images/pema-lite/rk-beach.webp',
        locationUrl:
          'https://www.google.com/maps/dir/Pema+Wellness+Resort,+Pema+Wellness+Resort,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh/VMRDA+INS+Kursura+Submarine+Museum,+P88J%2BV2W,+RK+Beach+Rd,+Kirlampudi+Layout,+Chinna+Waltair,+Pandurangapuram,+Visakhapatnam,+Andhra+Pradesh+530017/@17.7511919,83.331536,12.95z/data=!4m13!4m12!1m5!1m1!1s0x3a395b1ebe175f17:0x7ee8447f7684c9b7!2m2!1d83.3749694!2d17.7746517!1m5!1m1!1s0x3a394366bf4c70eb:0x954398b1ff5d09f2!2m2!1d83.3300912!2d17.7172432?entry=ttu&g_ep=EgoyMDI1MDkyOC4wIKXMDSoASAFQAw%3D%3D',
      },

      {
        title: 'Lambasingi trek',
        subtitle:
          'The trek usually passes through lush green valleys, coffee plantations, pine forests, and viewpoints overlooking mist-covered hills.',
        imageUrl: '/images/pema-lite/lambasingi-trek.webp',
        locationUrl:
          'https://www.google.com/maps/dir/Pema+Wellness+Resort,+Pema+Wellness+Resort,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh/Lammasinghi+trekking,+RF9V%2B83W,+Lambasingi,+Andhra+Pradesh+531118/@17.7334526,82.6061145,10z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3a395b1ebe175f17:0x7ee8447f7684c9b7!2m2!1d83.3749694!2d17.7746517!1m5!1m1!1s0x3a39f5bbb745a6b7:0xb9bd3e5fe37ee85a!2m2!1d82.4926961!2d17.8183634?entry=ttu&g_ep=EgoyMDI1MDkyOC4wIKXMDSoASAFQAw%3D%3D',
      },
    ],
    hasFourImages: true,
  },
  {
    id: 2,
    tab: 'For the spiritually curious',
    images: [
      {
        title: 'Simhachalam temple',
        subtitle: 'one of India’s oldest hilltop shrines',
        imageUrl: '/images/pema-lite/simhachalam-temple.webp',
        locationUrl:
          'https://www.google.com/maps/dir/Pema+Wellness+Resort,+Pema+Wellness+Resort,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh/Shri+Varahalakshmi+Narasimha+Swami+Temple,+Simhachalam+Rd,+Simhachalam,+Visakhapatnam,+Andhra+Pradesh+530028/@17.7691034,83.2718731,13z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3a395b1ebe175f17:0x7ee8447f7684c9b7!2m2!1d83.3749694!2d17.7746517!1m5!1m1!1s0x3a39678adaf94731:0x6789f78c46d2ec2b!2m2!1d83.2505322!2d17.7663525?entry=ttu&g_ep=EgoyMDI1MDkyOC4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        title: 'Private temple tours',
        subtitle: 'guided access into sacred, lesser-known sites',
        imageUrl: '/images/pema-lite/private-temple.webp',
      },
      {
        title: 'Thotlakonda buddhist complex',
        subtitle: 'ancient ruins and quiet reflection',
        imageUrl: '/images/pema-lite/thotlakonda-buddhist.webp',
        locationUrl:
          'https://www.google.com/maps/dir/Pema+Wellness+Resort,+Pema+Wellness+Resort,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh/Thotlakonda+Buddhist+Monastery,+RCH5%2BCM3,+Visakhapatnam,+Andhra+Pradesh+531163/@17.800658,83.3718409,13.82z/data=!4m13!4m12!1m5!1m1!1s0x3a395b1ebe175f17:0x7ee8447f7684c9b7!2m2!1d83.3749694!2d17.7746517!1m5!1m1!1s0x3a395a11c2c58d19:0x8e6d7c39c4a7b6f6!2m2!1d83.4091754!2d17.828513?entry=ttu&g_ep=EgoyMDI1MDkyOC4wIKXMDSoASAFQAw%3D%3D',
      },
    ],
    hasFourImages: false,
  },
  {
    id: 3,
    tab: 'For the explorer',
    images: [
      {
        title: 'Araku valley',
        subtitle: 'tribal traditions, scenic drives, waterfalls',
        imageUrl: '/images/pema-lite/araku-valley.webp',
        locationUrl:
          'https://www.google.com/maps/dir/Pema+Wellness+Resort,+Pema+Wellness+Resort,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh/Araku+Valley,+Andhra+Pradesh+531149/@18.0389974,82.8223757,10z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3a395b1ebe175f17:0x7ee8447f7684c9b7!2m2!1d83.3749694!2d17.7746517!1m5!1m1!1s0x3a3a4a4c298a218d:0x2b8de4f914b5f996!2m2!1d82.8801765!2d18.3222221?entry=ttu&g_ep=EgoyMDI1MDkyOC4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        title: 'Vizag to Araku toy train',
        subtitle: ' a slow ride through mist and mountain',
        imageUrl: '/images/pema-lite/vizag-to-araku-toy-train.webp',
      },
      {
        title: 'Borra caves ',
        subtitle: 'breathtaking natural limestone formations',
        imageUrl: '/images/pema-lite/borra-caves.webp',
        locationUrl:
          'https://www.google.com/maps/dir/Pema+Wellness+Resort,+Pema+Wellness+Resort,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh/Borra+Caves,+Andhra+Pradesh+535145/@18.0182332,82.8971063,10z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3a395b1ebe175f17:0x7ee8447f7684c9b7!2m2!1d83.3749694!2d17.7746517!1m5!1m1!1s0x3a3bc834502bc679:0x2f0b7af29a9a7137!2m2!1d83.0396992!2d18.2806929?entry=ttu&g_ep=EgoyMDI1MDkyOC4wIKXMDSoASAFQAw%3D%3D',
      },
    ],
    hasFourImages: false,
  },
  {
    id: 4,
    tab: 'For the wanderer',
    images: [
      {
        title: 'Kailasagiri Hilltop Park',
        subtitle: 'ropeway rides and panoramic views',
        imageUrl: '/images/pema-lite/kailasagiri-hilltop.webp',
        locationUrl:
          'https://www.google.com/maps/dir/Pema+Wellness+Resort,+Pema+Wellness+Resort,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh/VMRDA-Kailasagiri,+P8XR%2BHVC,+Hill+Top+Rd,+Kailasagiri,+Visakhapatnam,+Andhra+Pradesh+530043/@17.762241,83.3400568,14z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3a395b1ebe175f17:0x7ee8447f7684c9b7!2m2!1d83.3749694!2d17.7746517!1m5!1m1!1s0x3a395b538452a445:0xcf4f040d44ed5c61!2m2!1d83.3421514!2d17.7489421?entry=ttu&g_ep=EgoyMDI1MDkyOC4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        title: 'Charming cafés & local shops',
        subtitle: 'vibrant streets and quiet corners',
        imageUrl: '/images/pema-lite/charming-cafes.webp',
      },
      {
        title: 'Tribal art trails',
        subtitle: 'culture, craft, and community',
        imageUrl: '/images/pema-lite/tribal-art-trails.webp',
      },
    ],
    hasFourImages: false,
  },
]
