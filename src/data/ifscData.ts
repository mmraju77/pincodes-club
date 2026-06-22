export type Branch = {
  bankName: string;
  name: string;
  slug: string;
  ifsc: string;
  micr: string;
  address: string;
  contact: string;
  city: string;
  district: string;
  state: string;
};

export type City = {
  name: string;
  slug: string;
  branches: Branch[];
};

export type BankState = {
  name: string;
  slug: string;
  cities: City[];
};

export type Bank = {
  name: string;
  slug: string;
  states: BankState[];
};

export const bankDatabase: Bank[] = [
  {
    name: 'State Bank of India',
    slug: 'sbi',
    states: [
      {
        name: 'Telangana',
        slug: 'telangana',
        cities: [
          {
            name: 'Hyderabad',
            slug: 'hyderabad',
            branches: [
              {
                bankName: 'State Bank of India',
                name: 'Ameerpet',
                slug: 'ameerpet',
                ifsc: 'SBIN0001234',
                micr: '500002011',
                address: 'Main Road, Ameerpet, Hyderabad, Telangana 500016',
                contact: '+91-40-12345678',
                city: 'Hyderabad',
                district: 'Hyderabad',
                state: 'Telangana',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'HDFC Bank',
    slug: 'hdfc',
    states: [
      {
        name: 'Andhra Pradesh',
        slug: 'andhra-pradesh',
        cities: [
          {
            name: 'Visakhapatnam',
            slug: 'vizag',
            branches: [
              {
                bankName: 'HDFC Bank',
                name: 'MVP Colony',
                slug: 'mvp-colony',
                ifsc: 'HDFC0004567',
                micr: '530240002',
                address: 'Sector 4, MVP Colony, Visakhapatnam, Andhra Pradesh 530017',
                contact: '+91-891-9876543',
                city: 'Visakhapatnam',
                district: 'Visakhapatnam',
                state: 'Andhra Pradesh',
              },
            ],
          },
        ],
      },
    ],
  },
];
