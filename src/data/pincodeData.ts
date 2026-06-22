export type PostOffice = {
  name: string;
  slug: string;
  pincode: string;
  deliveryStatus: 'Delivery' | 'Non-Delivery';
  state: string;
  district: string;
  taluk: string;
  region: string;
  circle: string;
  division: string;
};

export type Taluk = {
  name: string;
  slug: string;
  offices: PostOffice[];
};

export type District = {
  name: string;
  slug: string;
  taluks: Taluk[];
};

export type State = {
  name: string;
  slug: string;
  districts: District[];
};

export const postalDatabase: State[] = [
  {
    name: 'Andhra Pradesh',
    slug: 'andhra-pradesh',
    districts: [
      {
        name: 'Visakhapatnam',
        slug: 'visakhapatnam',
        taluks: [
          {
            name: 'Visakhapatnam Urban',
            slug: 'visakhapatnam-urban',
            offices: [
              { 
                name: 'Gajuwaka S.O', 
                pincode: '530026', 
                deliveryStatus: 'Delivery', 
                slug: 'gajuwaka',
                state: 'Andhra Pradesh',
                district: 'Visakhapatnam',
                taluk: 'Visakhapatnam Urban',
                region: 'Visakhapatnam',
                circle: 'Andhra Pradesh',
                division: 'Visakhapatnam'
              },
              { 
                name: 'MVP Colony', 
                pincode: '530017', 
                deliveryStatus: 'Delivery', 
                slug: 'mvp-colony',
                state: 'Andhra Pradesh',
                district: 'Visakhapatnam',
                taluk: 'Visakhapatnam Urban',
                region: 'Visakhapatnam',
                circle: 'Andhra Pradesh',
                division: 'Visakhapatnam'
              },
            ]
          }
        ]
      },
      {
        name: 'Anantapur',
        slug: 'anantapur',
        taluks: [
          {
            name: 'Anantapur',
            slug: 'anantapur-taluk',
            offices: [
              { 
                name: 'Anantapur H.O', 
                pincode: '515001', 
                deliveryStatus: 'Delivery', 
                slug: 'anantapur-ho',
                state: 'Andhra Pradesh',
                district: 'Anantapur',
                taluk: 'Anantapur',
                region: 'Kurnool',
                circle: 'Andhra Pradesh',
                division: 'Anantapur'
              },
            ]
          }
        ]
      },
    ],
  },
  {
    name: 'Telangana',
    slug: 'telangana',
    districts: [
      {
        name: 'Hyderabad',
        slug: 'hyderabad',
        taluks: [
          {
            name: 'Hyderabad',
            slug: 'hyderabad-taluk',
            offices: [
              { 
                name: 'Kukatpally', 
                pincode: '500072', 
                deliveryStatus: 'Delivery', 
                slug: 'kukatpally',
                state: 'Telangana',
                district: 'Hyderabad',
                taluk: 'Hyderabad',
                region: 'Hyderabad City',
                circle: 'Telangana',
                division: 'Hyderabad'
              },
              { 
                name: 'Ameerpet', 
                pincode: '500016', 
                deliveryStatus: 'Delivery', 
                slug: 'ameerpet',
                state: 'Telangana',
                district: 'Hyderabad',
                taluk: 'Hyderabad',
                region: 'Hyderabad City',
                circle: 'Telangana',
                division: 'Hyderabad'
              },
            ]
          }
        ]
      },
      {
        name: 'Rangareddy',
        slug: 'rangareddy',
        taluks: [
          {
            name: 'Shamshabad',
            slug: 'shamshabad-taluk',
            offices: [
              { 
                name: 'Shamshabad', 
                pincode: '501218', 
                deliveryStatus: 'Delivery', 
                slug: 'shamshabad',
                state: 'Telangana',
                district: 'Rangareddy',
                taluk: 'Shamshabad',
                region: 'Hyderabad',
                circle: 'Telangana',
                division: 'Hyderabad City'
              },
            ]
          }
        ]
      },
    ],
  },
];
