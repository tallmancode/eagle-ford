import type { OfferType } from '@/lib/specials/constants'

/**
 * Static seed data for specials import.
 * Generated from https://www.eagleford.co.za/specials/ via scripts/generate-specials-data.mjs
 */
export type SpecialSeedItem = {
  offerType: Extract<OfferType, 'price-point' | 'payment'>
  labelOverride: string
  cardImage: string
  /** Detail/hero image URL — same as cardImage for now */
  detailImageUrl: string
  /** Catalog vehicle family name or slug (e.g. "Next Level Ranger" / "next-level-ranger") */
  linkedVehicle?: string
  /** CMS vehicle-model name or slug (trim level, e.g. "Ranger XL" / "xl") */
  linkedModel?: string
  /** CMS vehicle-variant name or slug (configuration) */
  linkedVariant?: string
  specialOffer?: number
  bestSaving?: number
  paymentFrom?: number
  slug: string
}

export type SpecialSeedCategory = {
  specialsCategory: string
  specials: SpecialSeedItem[]
}

/** Flat entry used by the import route (category + item). */
export type SpecialSeedEntry = SpecialSeedItem & {
  specialsCategory: string
  sortOrder: number
}

export const DATA: SpecialSeedCategory[] = [
  {
    specialsCategory: 'Ranger Double Cab Specials',
    specials: [
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.0 XL 4x2 DC Manual',
        cardImage:
          'https://www.eagleford.co.za/specials/15849-next-level-ranger-2.0-xl-4x2-dc-manual/images/15849-1195fd5a-702f-4a6e-8d81-e87b0c87f342c7986659-91a4-4056-8626-8baa73cd57f8_Next-Level-Ranger-2-0-XL-4x2-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/15849-next-level-ranger-2.0-xl-4x2-dc-manual/images/15849-1195fd5a-702f-4a6e-8d81-e87b0c87f342c7986659-91a4-4056-8626-8baa73cd57f8_Next-Level-Ranger-2-0-XL-4x2-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger XL',
        slug: '15849-next-level-ranger-2.0-xl-4x2-dc-manual',
        specialOffer: 569900,
        bestSaving: 51100,
        linkedVariant: 'Ranger 2.0 SiT Double Cab XL 4x2 6MT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.0 XL 4x2 DC Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/15850-next-level-ranger-2.0-xl-4x2-dc-auto/images/15850-96eb591d-34f9-4d3c-badb-17c5ab386b9bd823e380-3dc7-4f99-aa7c-2a272cc28452_Next-Level-Ranger-2-0-XL-4x2-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/15850-next-level-ranger-2.0-xl-4x2-dc-auto/images/15850-96eb591d-34f9-4d3c-badb-17c5ab386b9bd823e380-3dc7-4f99-aa7c-2a272cc28452_Next-Level-Ranger-2-0-XL-4x2-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger XL',
        slug: '15850-next-level-ranger-2.0-xl-4x2-dc-auto',
        specialOffer: 559900,
        bestSaving: 91600,
        linkedVariant: 'Ranger 2.0 SiT Double Cab XL 4x2 6MT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.0 SIT XLT 4x2 DC Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/15889-next-level-ranger-2.0-sit-xlt-4x2-dc-auto/images/15889-2cc99ae7-6e07-4861-8c87-6c304980bbebe8d92ca0-952b-45f9-86e3-33976ed4b575_Next-Level-Ranger-2-0-XLT-4x2-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/15889-next-level-ranger-2.0-sit-xlt-4x2-dc-auto/images/15889-2cc99ae7-6e07-4861-8c87-6c304980bbebe8d92ca0-952b-45f9-86e3-33976ed4b575_Next-Level-Ranger-2-0-XLT-4x2-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger XLT',
        slug: '15889-next-level-ranger-2.0-sit-xlt-4x2-dc-auto',
        specialOffer: 599900,
        bestSaving: 99600,
        linkedVariant: 'Ranger 2.0 SiT Double Cab XLT 4x2 10AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER DC 4X2 2.0L SIT XL 6MT',
        cardImage:
          'https://www.eagleford.co.za/specials/17896-ranger-dc-4x2-2.0l-sit-xl-6mt/images/17896-3106717d-b086-4521-9d32-bc94e8ccbe7d64b80faf-9990-4689-8402-9354e22b19da_Ranger-Double-Cab-XL.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17896-ranger-dc-4x2-2.0l-sit-xl-6mt/images/17896-3106717d-b086-4521-9d32-bc94e8ccbe7d64b80faf-9990-4689-8402-9354e22b19da_Ranger-Double-Cab-XL.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger XL',
        slug: '17896-ranger-dc-4x2-2.0l-sit-xl-6mt',
        paymentFrom: 8399,
        linkedVariant: 'Ranger 2.0 SiT Double Cab XL 4x2 6MT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER DC 4X2 2.0L SIT XL 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17897-ranger-dc-4x2-2.0l-sit-xl-10at/images/17897-a5df5995-b01b-42d1-979c-aa569e131d061e9ef5ee-9d0c-4d90-8844-0022a15dce71_Ranger-Double-Cab-XL.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17897-ranger-dc-4x2-2.0l-sit-xl-10at/images/17897-a5df5995-b01b-42d1-979c-aa569e131d061e9ef5ee-9d0c-4d90-8844-0022a15dce71_Ranger-Double-Cab-XL.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger XL',
        slug: '17897-ranger-dc-4x2-2.0l-sit-xl-10at',
        paymentFrom: 8099,
        linkedVariant: 'Ranger 2.0 SiT Double Cab XL 4x2 6MT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.0 XL 4x4 DC Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/15893-next-level-ranger-2.0-xl-4x4-dc-auto/images/15893-f0df347c-4f8b-4ff6-90c7-d1077f13051d5d9bb289-9b71-44fa-8040-395cec74c2d8_Next-Level-Ranger-2-0-XL-4x4-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/15893-next-level-ranger-2.0-xl-4x4-dc-auto/images/15893-f0df347c-4f8b-4ff6-90c7-d1077f13051d5d9bb289-9b71-44fa-8040-395cec74c2d8_Next-Level-Ranger-2-0-XL-4x4-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger XL',
        slug: '15893-next-level-ranger-2.0-xl-4x4-dc-auto',
        specialOffer: 659900,
        bestSaving: 75100,
        linkedVariant: 'Ranger 2.0 SiT Double Cab XL 4x2 6MT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER DC 4X2 2.0L SIT XLT 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17900-ranger-dc-4x2-2.0l-sit-xlt-10at/images/17900-3faf86a6-db21-404d-aa4e-c81d30da24414aeca424-48b1-4a7a-88f9-fd8fd2aaf1f7_XLT-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17900-ranger-dc-4x2-2.0l-sit-xlt-10at/images/17900-3faf86a6-db21-404d-aa4e-c81d30da24414aeca424-48b1-4a7a-88f9-fd8fd2aaf1f7_XLT-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger XLT',
        slug: '17900-ranger-dc-4x2-2.0l-sit-xlt-10at',
        paymentFrom: 8599,
        linkedVariant: 'Ranger 2.0 SiT Double Cab XLT 4x2 10AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER DC 4X4 2.0L SIT XL 6MT',
        cardImage:
          'https://www.eagleford.co.za/specials/17898-ranger-dc-4x4-2.0l-sit-xl-6mt/images/17898-c1f91866-7f0b-4fae-9fc3-51f82a8ba0240722f871-245f-4af6-ba26-9674678c3047_Ranger-Double-Cab-XL.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17898-ranger-dc-4x4-2.0l-sit-xl-6mt/images/17898-c1f91866-7f0b-4fae-9fc3-51f82a8ba0240722f871-245f-4af6-ba26-9674678c3047_Ranger-Double-Cab-XL.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger XL',
        slug: '17898-ranger-dc-4x4-2.0l-sit-xl-6mt',
        paymentFrom: 9399,
        linkedVariant: 'Ranger 2.0 SiT Double Cab XL 4x2 6MT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.0 SIT XLT 4x4 DC Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/15894-next-level-ranger-2.0-sit-xlt-4x4-dc-auto/images/15894-9a84b273-5796-4caa-8161-daf754199e2fdf4e1a8c-7528-4d87-b876-5d07f9c7e7fd_Next-Level-Ranger-2-0-XLT-4x4-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/15894-next-level-ranger-2.0-sit-xlt-4x4-dc-auto/images/15894-9a84b273-5796-4caa-8161-daf754199e2fdf4e1a8c-7528-4d87-b876-5d07f9c7e7fd_Next-Level-Ranger-2-0-XLT-4x4-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger XLT',
        slug: '15894-next-level-ranger-2.0-sit-xlt-4x4-dc-auto',
        specialOffer: 712900,
        bestSaving: 75600,
        linkedVariant: 'Ranger 2.0 SiT Double Cab XLT 4x2 10AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER DC 4X4 2.0L SIT XL 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17899-ranger-dc-4x4-2.0l-sit-xl-10at/images/17899-ebbe4107-48fd-4cc2-a085-3e3b8c166c38b8a1238c-93a9-47dc-8a4d-859066045f7e_Ranger-Double-Cab-XL.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17899-ranger-dc-4x4-2.0l-sit-xl-10at/images/17899-ebbe4107-48fd-4cc2-a085-3e3b8c166c38b8a1238c-93a9-47dc-8a4d-859066045f7e_Ranger-Double-Cab-XL.webp',
        linkedVehicle: 'Next Level Ranger',
        slug: '17899-ranger-dc-4x4-2.0l-sit-xl-10at',
        paymentFrom: 9899,
        linkedModel: 'Ranger XL',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.3 Sport 4x2 DC Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/16295-next-level-ranger-2.3-sport-4x2-dc-auto/images/16295-39e816aa-2b80-4775-9cd2-ab6b9f6e9077b2d55b44-6e6c-447d-ad60-5400b59bcda0_Next-Level-Ranger-2-3-Sport-4x2-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/16295-next-level-ranger-2.3-sport-4x2-dc-auto/images/16295-39e816aa-2b80-4775-9cd2-ab6b9f6e9077b2d55b44-6e6c-447d-ad60-5400b59bcda0_Next-Level-Ranger-2-3-Sport-4x2-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Sport',
        slug: '16295-next-level-ranger-2.3-sport-4x2-dc-auto',
        specialOffer: 744900,
        bestSaving: 94700,
        linkedVariant: 'Ranger 2.3L Double Cab Sport 4x2 10AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER DC 4X4 2.0L SIT XLT 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17901-ranger-dc-4x4-2.0l-sit-xlt-10at/images/17901-837142d5-ae97-468e-80d8-5e1c3e28e26ff4fa9719-2083-4a2d-a26d-487f271aa6ab_XLT-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17901-ranger-dc-4x4-2.0l-sit-xlt-10at/images/17901-837142d5-ae97-468e-80d8-5e1c3e28e26ff4fa9719-2083-4a2d-a26d-487f271aa6ab_XLT-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger XLT',
        slug: '17901-ranger-dc-4x4-2.0l-sit-xlt-10at',
        paymentFrom: 10199,
        linkedVariant: 'Ranger 2.0 SiT Double Cab XLT 4x2 10AT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.3 Wildtrak 4x2 DC Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/16296-next-level-ranger-2.3-wildtrak-4x2-dc-auto/images/16296-f01dda91-b1d0-482f-876c-0fcc66a4250b0e8de94e-982f-47c0-b301-98547bcf7c38_Next-Level-Ranger-2-3-Wildtrak-4x2-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/16296-next-level-ranger-2.3-wildtrak-4x2-dc-auto/images/16296-f01dda91-b1d0-482f-876c-0fcc66a4250b0e8de94e-982f-47c0-b301-98547bcf7c38_Next-Level-Ranger-2-3-Wildtrak-4x2-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Wildtrak',
        slug: '16296-next-level-ranger-2.3-wildtrak-4x2-dc-auto',
        specialOffer: 799900,
        bestSaving: 99100,
        linkedVariant: 'Ranger 2.3L Double Cab Wildtrak 4x2 10AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER DC 4X2 2.3L TC SPORT 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17902-ranger-dc-4x2-2.3l-tc-sport-10at/images/17902-2e2e384b-31ec-46d0-98b6-4660e2fa8eed52053b59-0c4d-4250-abe0-7a14056e15f7_Sport-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17902-ranger-dc-4x2-2.3l-tc-sport-10at/images/17902-2e2e384b-31ec-46d0-98b6-4660e2fa8eed52053b59-0c4d-4250-abe0-7a14056e15f7_Sport-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Sport',
        slug: '17902-ranger-dc-4x2-2.3l-tc-sport-10at',
        paymentFrom: 10899,
        linkedVariant: 'Ranger 2.3L Double Cab Sport 4x2 10AT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 3.0 V6 Sport 4x4 DC Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/16297-next-level-ranger-3.0-v6-sport-4x4-dc-auto/images/16297-a0004c94-fd42-46a5-8761-aad3b2183333b81a10e5-1f0d-488f-9fd0-9a38ea816a4b_Next-Level-Ranger-3-0-Sport-4x4-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/16297-next-level-ranger-3.0-v6-sport-4x4-dc-auto/images/16297-a0004c94-fd42-46a5-8761-aad3b2183333b81a10e5-1f0d-488f-9fd0-9a38ea816a4b_Next-Level-Ranger-3-0-Sport-4x4-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Tremor',
        slug: '16297-next-level-ranger-3.0-v6-sport-4x4-dc-auto',
        specialOffer: 874900,
        bestSaving: 120100,
        linkedVariant: 'Ranger 3.0L V6 Double Cab Tremor 4x4 10AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER DC 4X2 2.3L TC WILDTRAK 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17903-ranger-dc-4x2-2.3l-tc-wildtrak-10at/images/17903-2e417ec7-e981-4a71-b43a-e1b1aa6c6fd0557a237a-bc15-4275-bf6e-ff49a7411412_Sport-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17903-ranger-dc-4x2-2.3l-tc-wildtrak-10at/images/17903-2e417ec7-e981-4a71-b43a-e1b1aa6c6fd0557a237a-bc15-4275-bf6e-ff49a7411412_Sport-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Wildtrak',
        slug: '17903-ranger-dc-4x2-2.3l-tc-wildtrak-10at',
        paymentFrom: 11699,
        linkedVariant: 'Ranger 2.3L Double Cab Wildtrak 4x2 10AT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 3.0 V6 Tremor 4x4 DC Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/16298-next-level-ranger-3.0-v6-tremor-4x4-dc-auto/images/16298-349500b2-c72f-4c03-af9f-864970fe81194da4edb0-d828-447b-9db1-0d18267bfe8a_Next-Level-Ranger-3-0-Tremor-4x4-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/16298-next-level-ranger-3.0-v6-tremor-4x4-dc-auto/images/16298-349500b2-c72f-4c03-af9f-864970fe81194da4edb0-d828-447b-9db1-0d18267bfe8a_Next-Level-Ranger-3-0-Tremor-4x4-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Tremor',
        slug: '16298-next-level-ranger-3.0-v6-tremor-4x4-dc-auto',
        specialOffer: 964900,
        bestSaving: 74100,
        linkedVariant: 'Ranger 3.0L V6 Double Cab Tremor 4x4 10AT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 3.0 V6 Wildtrak 4x4 DC Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/15896-next-level-ranger-3.0-v6-wildtrak-4x4-dc-auto/images/15896-ac7884f2-1acd-4a9f-a0a3-03fc134282f56e03e98b-c452-4bc8-83ee-c3fba3c65039_Next-Level-Ranger-3-0-Wildtrak-4x4-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/15896-next-level-ranger-3.0-v6-wildtrak-4x4-dc-auto/images/15896-ac7884f2-1acd-4a9f-a0a3-03fc134282f56e03e98b-c452-4bc8-83ee-c3fba3c65039_Next-Level-Ranger-3-0-Wildtrak-4x4-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Wildtrak',
        slug: '15896-next-level-ranger-3.0-v6-wildtrak-4x4-dc-auto',
        specialOffer: 965900,
        bestSaving: 104100,
        linkedVariant: 'Ranger 3.0L V6 Double Cab Wildtrak 4x4 10AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER DC 4WD 3.0L V6 SPORT 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17904-ranger-dc-4wd-3.0l-v6-sport-10at/images/17904-e9e228b7-c0d2-449c-9048-09d8218fba0d27f2fc2b-aa72-4827-acd0-b86054e2a0c9_Sport-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17904-ranger-dc-4wd-3.0l-v6-sport-10at/images/17904-e9e228b7-c0d2-449c-9048-09d8218fba0d27f2fc2b-aa72-4827-acd0-b86054e2a0c9_Sport-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Tremor',
        slug: '17904-ranger-dc-4wd-3.0l-v6-sport-10at',
        paymentFrom: 13099,
        linkedVariant: 'Ranger 3.0L V6 Double Cab Tremor 4x4 10AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER DC 4WD 3.0L V6 TREMOR 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17905-ranger-dc-4wd-3.0l-v6-tremor-10at/images/17905-a9ba8196-1847-418b-86c8-6e5ba14099df43bf0576-6d3b-4418-bcd1-5f84a501567f_Tremor.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17905-ranger-dc-4wd-3.0l-v6-tremor-10at/images/17905-a9ba8196-1847-418b-86c8-6e5ba14099df43bf0576-6d3b-4418-bcd1-5f84a501567f_Tremor.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Tremor',
        slug: '17905-ranger-dc-4wd-3.0l-v6-tremor-10at',
        paymentFrom: 13999,
        linkedVariant: 'Ranger 3.0L V6 Double Cab Tremor 4x4 10AT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 3.0 V6 Platinum 4x4 DC Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/18393-next-level-ranger-3.0-v6-platinum-4x4-dc-auto/images/18393-9629bc08-335a-4ad8-b6dc-832e597f75a64ea97ad2-4b19-495e-8718-996282063744_download.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/18393-next-level-ranger-3.0-v6-platinum-4x4-dc-auto/images/18393-9629bc08-335a-4ad8-b6dc-832e597f75a64ea97ad2-4b19-495e-8718-996282063744_download.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Platinum',
        slug: '18393-next-level-ranger-3.0-v6-platinum-4x4-dc-auto',
        specialOffer: 1064900,
        bestSaving: 114600,
        linkedVariant: 'Ranger 3.0L V6 Double Cab Platinum 4x4 10AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER DC 4WD 3.0L V6 WILDTRAK 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17906-ranger-dc-4wd-3.0l-v6-wildtrak-10at/images/17906-b7ddae63-bb40-4554-86f5-36af9b33bd9c66bebfee-ec68-40ad-9848-5acd1b9cde07_Wildtrack-DC.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17906-ranger-dc-4wd-3.0l-v6-wildtrak-10at/images/17906-b7ddae63-bb40-4554-86f5-36af9b33bd9c66bebfee-ec68-40ad-9848-5acd1b9cde07_Wildtrack-DC.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Wildtrak',
        slug: '17906-ranger-dc-4wd-3.0l-v6-wildtrak-10at',
        paymentFrom: 13899,
        linkedVariant: 'Ranger 3.0L V6 Double Cab Wildtrak 4x4 10AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER DC 4WD 3.0L V6 PLATINUM 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17907-ranger-dc-4wd-3.0l-v6-platinum-10at/images/17907-51d9fe60-a1cb-47fe-81e2-a66ea44d3f6f18072a38-2ce2-4021-a077-35512f4b1bc3_Ranger-Platinum.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17907-ranger-dc-4wd-3.0l-v6-platinum-10at/images/17907-51d9fe60-a1cb-47fe-81e2-a66ea44d3f6f18072a38-2ce2-4021-a077-35512f4b1bc3_Ranger-Platinum.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Platinum',
        slug: '17907-ranger-dc-4wd-3.0l-v6-platinum-10at',
        paymentFrom: 15499,
        linkedVariant: 'Ranger 3.0L V6 Double Cab Platinum 4x4 10AT',
      },
    ],
  },
  {
    specialsCategory: 'Ranger Super Cab Specials',
    specials: [
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.0 XL 4x2 Super Cab Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/15886-next-level-ranger-2.0-xl-4x2-super-cab-auto/images/15886-ab08765d-cfee-49b4-8a78-255339f7bfeb8dddc466-b3fc-4f27-bd69-4ce915337a36_Next-Level-Ranger-2-0-XL-4x2-Super-Cab-A.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/15886-next-level-ranger-2.0-xl-4x2-super-cab-auto/images/15886-ab08765d-cfee-49b4-8a78-255339f7bfeb8dddc466-b3fc-4f27-bd69-4ce915337a36_Next-Level-Ranger-2-0-XL-4x2-Super-Cab-A.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Super Cab',
        slug: '15886-next-level-ranger-2.0-xl-4x2-super-cab-auto',
        specialOffer: 519900,
        bestSaving: 79600,
        linkedVariant: 'Ranger 2.0 SiT Super Cab XL 4x2 6AT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.0 SiT XLT 4x2 Super Cab Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/15888-next-level-ranger-2.0-sit-xlt-4x2-super-cab-auto/images/15888-ce4213a4-2be6-45de-bf63-3647cd4b5b8b3a194ad4-13e3-44fd-ae24-ce2b13daaa9f_Next-Level-Ranger-2-0-XLT-4x2-Super-Cab-A.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/15888-next-level-ranger-2.0-sit-xlt-4x2-super-cab-auto/images/15888-ce4213a4-2be6-45de-bf63-3647cd4b5b8b3a194ad4-13e3-44fd-ae24-ce2b13daaa9f_Next-Level-Ranger-2-0-XLT-4x2-Super-Cab-A.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Super Cab',
        slug: '15888-next-level-ranger-2.0-sit-xlt-4x2-super-cab-auto',
        specialOffer: 555900,
        bestSaving: 99100,
        linkedVariant: 'Ranger 2.0 SiT Super Cab XL 4x2 6AT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.0 XL 4x4 Super Cab Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/18389-next-level-ranger-2.0-xl-4x4-super-cab-auto/images/18389-74e29c4e-ec0f-4677-b9c6-e2f3fdeff4afcffc8b10-4b0a-4bc4-acf1-4ee4ef80612a_9a8f40d7-44aa-45a9-bb9c-2c45729bc535.png',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/18389-next-level-ranger-2.0-xl-4x4-super-cab-auto/images/18389-74e29c4e-ec0f-4677-b9c6-e2f3fdeff4afcffc8b10-4b0a-4bc4-acf1-4ee4ef80612a_9a8f40d7-44aa-45a9-bb9c-2c45729bc535.png',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Super Cab',
        slug: '18389-next-level-ranger-2.0-xl-4x4-super-cab-auto',
        specialOffer: 582900,
        bestSaving: 67432,
        linkedVariant: 'Ranger 2.0 SiT Super Cab XL 4x2 6AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER SUP 4X2 2.0L SIT XL 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17889-ranger-sup-4x2-2.0l-sit-xl-10at/images/17889-7b828e52-0ea9-48df-83de-b70f9fedd11cd78fc82b-d203-45bd-a868-17ab25727a51_Ranger-Super-Cab-XL.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17889-ranger-sup-4x2-2.0l-sit-xl-10at/images/17889-7b828e52-0ea9-48df-83de-b70f9fedd11cd78fc82b-d203-45bd-a868-17ab25727a51_Ranger-Super-Cab-XL.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Super Cab',
        slug: '17889-ranger-sup-4x2-2.0l-sit-xl-10at',
        paymentFrom: 7699,
        linkedVariant: 'Ranger 2.0 SiT Super Cab XL 4x2 6AT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.3 Sport 4x2 Super Cab',
        cardImage:
          'https://www.eagleford.co.za/specials/15898-next-level-ranger-2.3-sport-4x2-super-cab/images/15898-db6de789-c030-406c-8366-9008a0fad3dd045d4ccd-741e-41b2-9c04-442fb21c31b5_Next-Level-Ranger-2-3-Sport-4x2-Super-Cab-A.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/15898-next-level-ranger-2.3-sport-4x2-super-cab/images/15898-db6de789-c030-406c-8366-9008a0fad3dd045d4ccd-741e-41b2-9c04-442fb21c31b5_Next-Level-Ranger-2-3-Sport-4x2-Super-Cab-A.webp',
        linkedVehicle: 'Next Level Ranger',
        slug: '15898-next-level-ranger-2.3-sport-4x2-super-cab',
        specialOffer: 655900,
        bestSaving: 79100,
        linkedModel: 'Ranger Super Cab',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER SUP 4X2 2.0L SIT XLT 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17891-ranger-sup-4x2-2.0l-sit-xlt-10at/images/17891-99379bad-7139-4528-92cf-c9bd0ffd526a7e16dbff-1113-403a-8ea2-830d21ea253b_XLT-SUP-CAB.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17891-ranger-sup-4x2-2.0l-sit-xlt-10at/images/17891-99379bad-7139-4528-92cf-c9bd0ffd526a7e16dbff-1113-403a-8ea2-830d21ea253b_XLT-SUP-CAB.webp',
        linkedVehicle: 'Next Level Ranger',
        slug: '17891-ranger-sup-4x2-2.0l-sit-xlt-10at',
        paymentFrom: 8099,
        linkedModel: 'Ranger Super Cab',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.0 SiT XLT 4x4 Super Cab Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/15887-next-level-ranger-2.0-sit--xlt-4x4-super-cab--auto/images/15887-47c583cf-f9eb-4cde-bf40-39a2588d99105b45d795-4cfa-4b7f-b028-0db092aac718_Next-Level-Ranger-2-0-XLT-4x4-Super-Cab-A.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/15887-next-level-ranger-2.0-sit--xlt-4x4-super-cab--auto/images/15887-47c583cf-f9eb-4cde-bf40-39a2588d99105b45d795-4cfa-4b7f-b028-0db092aac718_Next-Level-Ranger-2-0-XLT-4x4-Super-Cab-A.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Super Cab',
        slug: '15887-next-level-ranger-2.0-sit--xlt-4x4-super-cab--auto',
        specialOffer: 669900,
        bestSaving: 61100,
        linkedVariant: 'Ranger 2.0 SiT Super Cab XL 4x2 6AT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.3 Sport 4x2 Super Cab Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/18390-next-level-ranger-2.3-sport-4x2-super-cab-auto/images/18390-52c83fb4-1014-4ad7-9406-03641327a0b77d90b5d3-fdc4-4198-9805-8fb38074a52d_download.png',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/18390-next-level-ranger-2.3-sport-4x2-super-cab-auto/images/18390-52c83fb4-1014-4ad7-9406-03641327a0b77d90b5d3-fdc4-4198-9805-8fb38074a52d_download.png',
        linkedVehicle: 'Next Level Ranger',
        slug: '18390-next-level-ranger-2.3-sport-4x2-super-cab-auto',
        specialOffer: 676900,
        bestSaving: 58100,
        linkedModel: 'Ranger Super Cab',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER SUP 4X4 2.0L SIT XL 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17890-ranger-sup-4x4-2.0l-sit-xl-10at/images/17890-c4959e33-62a0-4bb1-a56c-61a06f4cd356e98c7a0e-af6c-4589-a7cb-718d677aade0_Ranger-Super-Cab-XL.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17890-ranger-sup-4x4-2.0l-sit-xl-10at/images/17890-c4959e33-62a0-4bb1-a56c-61a06f4cd356e98c7a0e-af6c-4589-a7cb-718d677aade0_Ranger-Super-Cab-XL.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Super Cab',
        slug: '17890-ranger-sup-4x4-2.0l-sit-xl-10at',
        paymentFrom: 8799,
        linkedVariant: 'Ranger 2.0 SiT Super Cab XL 4x2 6AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER SUP 4X4 2.0L SIT XLT 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17892-ranger-sup-4x4-2.0l-sit-xlt-10at/images/17892-d72b2fbe-1ceb-47e9-b2a0-026798697cc3e4667126-4748-4555-b007-d5e1f0b7a601_XLT-SUP-CAB.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17892-ranger-sup-4x4-2.0l-sit-xlt-10at/images/17892-d72b2fbe-1ceb-47e9-b2a0-026798697cc3e4667126-4748-4555-b007-d5e1f0b7a601_XLT-SUP-CAB.webp',
        linkedVehicle: 'Next Level Ranger',
        slug: '17892-ranger-sup-4x4-2.0l-sit-xlt-10at',
        paymentFrom: 9899,
        linkedModel: 'Ranger Super Cab',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER SUP 4X2 2.3L TC SPORT 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17893-ranger-sup-4x2-2.3l-tc-sport-10at/images/17893-149378ba-27aa-453f-a8f9-403ffc384f766169870d-a9a9-4fc5-a3c5-2f718cbc333c_Sport-Sup-Cab.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17893-ranger-sup-4x2-2.3l-tc-sport-10at/images/17893-149378ba-27aa-453f-a8f9-403ffc384f766169870d-a9a9-4fc5-a3c5-2f718cbc333c_Sport-Sup-Cab.webp',
        linkedVehicle: 'Next Level Ranger',
        slug: '17893-ranger-sup-4x2-2.3l-tc-sport-10at',
        paymentFrom: 9899,
        linkedModel: 'Ranger Super Cab',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 3.0 V6 Sport 4x4 Super Cab Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/18391-next-level-ranger-3.0-v6-sport-4x4-super-cab-auto/images/18391-da7bdc16-442c-4714-b917-a45240cc19185dd6aa0f-1f90-4dcb-8c7e-2472ee55ecae_download.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/18391-next-level-ranger-3.0-v6-sport-4x4-super-cab-auto/images/18391-da7bdc16-442c-4714-b917-a45240cc19185dd6aa0f-1f90-4dcb-8c7e-2472ee55ecae_download.webp',
        linkedVehicle: 'Next Level Ranger',
        slug: '18391-next-level-ranger-3.0-v6-sport-4x4-super-cab-auto',
        specialOffer: 767900,
        bestSaving: 57100,
        linkedModel: 'Ranger Super Cab',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 3.0 V6 Wildtrak 4x4 Super Cab Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/18392-next-level-ranger-3.0-v6-wildtrak-4x4-super-cab-auto/images/18392-7b168679-f5a5-4d76-ad62-919c7184de825bcbf40b-295e-43f6-bfbf-7414990923f1_download.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/18392-next-level-ranger-3.0-v6-wildtrak-4x4-super-cab-auto/images/18392-7b168679-f5a5-4d76-ad62-919c7184de825bcbf40b-295e-43f6-bfbf-7414990923f1_download.webp',
        linkedVehicle: 'Next Level Ranger',
        slug: '18392-next-level-ranger-3.0-v6-wildtrak-4x4-super-cab-auto',
        specialOffer: 784900,
        bestSaving: 80100,
        linkedModel: 'Ranger Super Cab',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER SUP 4WD 3.0L V6 SPORT 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17894-ranger-sup-4wd-3.0l-v6-sport-10at/images/17894-66e4bd61-b520-4ebc-8deb-b9792eb87cf06ff690ab-58fa-4679-8dcc-26d406ccd234_Wildtrak-Sup-Cab.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17894-ranger-sup-4wd-3.0l-v6-sport-10at/images/17894-66e4bd61-b520-4ebc-8deb-b9792eb87cf06ff690ab-58fa-4679-8dcc-26d406ccd234_Wildtrak-Sup-Cab.webp',
        linkedVehicle: 'Next Level Ranger',
        slug: '17894-ranger-sup-4wd-3.0l-v6-sport-10at',
        paymentFrom: 11199,
        linkedModel: 'Ranger Super Cab',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER SUP 4WD 3.0L V6 WILDTRAK 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17895-ranger-sup-4wd-3.0l-v6-wildtrak-10at/images/17895-15f4d3a6-3afe-4731-9594-ffca7253ac5a0fb70223-5b3e-4f9d-a3c3-96b9267853d8_Wildtrak-Sup-Cab.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17895-ranger-sup-4wd-3.0l-v6-wildtrak-10at/images/17895-15f4d3a6-3afe-4731-9594-ffca7253ac5a0fb70223-5b3e-4f9d-a3c3-96b9267853d8_Wildtrak-Sup-Cab.webp',
        linkedVehicle: 'Next Level Ranger',
        slug: '17895-ranger-sup-4wd-3.0l-v6-wildtrak-10at',
        paymentFrom: 11299,
        linkedModel: 'Ranger Super Cab',
      },
    ],
  },
  {
    specialsCategory: 'Ranger Single Cab Specials',
    specials: [
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.0 XL 4x2 Single Cab Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/15873-next-level-ranger-2.0-xl-4x2-single-cab-auto/images/15873-fe6fdf6a-8890-45bf-9b68-cbbd92823f7fbc47faa3-cce5-4c81-8ee2-606204d5ef04_Next-Level-Ranger-2-0-XL-4x2-Single-Cab-A.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/15873-next-level-ranger-2.0-xl-4x2-single-cab-auto/images/15873-fe6fdf6a-8890-45bf-9b68-cbbd92823f7fbc47faa3-cce5-4c81-8ee2-606204d5ef04_Next-Level-Ranger-2-0-XL-4x2-Single-Cab-A.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Single Cab',
        slug: '15873-next-level-ranger-2.0-xl-4x2-single-cab-auto',
        specialOffer: 515900,
        bestSaving: 74100,
        linkedVariant: 'Ranger 2.0 SiT Single Cab XL 4x2 10AT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Next Level Ranger 2.0 XL 4x4 Single Cab Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/15877-next-level-ranger-2.0-xl-4x4-single-cab-auto/images/15877-298df42a-1ad9-46b4-9f0b-dab8289dbb5968f11431-c206-4563-86b3-bc6468313f1c_Next-Level-Ranger-2-0-XL-4x4-Single-Cab-A.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/15877-next-level-ranger-2.0-xl-4x4-single-cab-auto/images/15877-298df42a-1ad9-46b4-9f0b-dab8289dbb5968f11431-c206-4563-86b3-bc6468313f1c_Next-Level-Ranger-2-0-XL-4x4-Single-Cab-A.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Single Cab',
        slug: '15877-next-level-ranger-2.0-xl-4x4-single-cab-auto',
        specialOffer: 579900,
        bestSaving: 86100,
        linkedVariant: 'Ranger 2.0 SiT Single Cab XL 4x4 10AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER SC 4X2 2.0L SIT XL 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17886-ranger-sc-4x2-2.0l-sit-xl-10at/images/17886-beaef745-9cbf-49f9-90b9-ba4df68c528bb0a5835c-1be7-4cde-a906-ae76e1a3fed8_Ranger-Single-Cab.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17886-ranger-sc-4x2-2.0l-sit-xl-10at/images/17886-beaef745-9cbf-49f9-90b9-ba4df68c528bb0a5835c-1be7-4cde-a906-ae76e1a3fed8_Ranger-Single-Cab.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Single Cab',
        slug: '17886-ranger-sc-4x2-2.0l-sit-xl-10at',
        paymentFrom: 7799,
        linkedVariant: 'Ranger 2.0 SiT Single Cab XL 4x2 10AT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER SC 4X4 2.0L SIT XL 6MT',
        cardImage:
          'https://www.eagleford.co.za/specials/17887-ranger-sc-4x4-2.0l-sit-xl-6mt/images/17887-fab0a3f9-c4e5-4e86-b86c-047a5bba64e1d6f7a374-8882-4a98-b18d-283b82518cf3_Ranger-Single-Cab.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17887-ranger-sc-4x4-2.0l-sit-xl-6mt/images/17887-fab0a3f9-c4e5-4e86-b86c-047a5bba64e1d6f7a374-8882-4a98-b18d-283b82518cf3_Ranger-Single-Cab.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Single Cab',
        slug: '17887-ranger-sc-4x4-2.0l-sit-xl-6mt',
        paymentFrom: 8599,
        linkedVariant: 'Ranger 2.0 SiT Single Cab XL 4x4 6MT',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER SC 4X4 2.0L SIT XL 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17888-ranger-sc-4x4-2.0l-sit-xl-10at/images/17888-1993e9ed-e9ec-4623-8590-cf5dd13e93f23be9dece-fd5c-443b-98df-67f4796fb9ee_Ranger-Single-Cab.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17888-ranger-sc-4x4-2.0l-sit-xl-10at/images/17888-1993e9ed-e9ec-4623-8590-cf5dd13e93f23be9dece-fd5c-443b-98df-67f4796fb9ee_Ranger-Single-Cab.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Single Cab',
        slug: '17888-ranger-sc-4x4-2.0l-sit-xl-10at',
        paymentFrom: 8899,
        linkedVariant: 'Ranger 2.0 SiT Single Cab XL 4x4 10AT',
      },
    ],
  },
  {
    specialsCategory: 'Territory Specials',
    specials: [
      {
        offerType: 'price-point',
        labelOverride: 'New Level Territory 1.8 Ambiente Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/16299-new-level-territory-1.8-ambiente-auto/images/16299-7b3ccf26-1e18-403b-8de8-597e55a91a79e3bab0fd-121a-4c18-bd4b-c5c86ab2a363_New-Territory-PNG_Ambiente.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/16299-new-level-territory-1.8-ambiente-auto/images/16299-7b3ccf26-1e18-403b-8de8-597e55a91a79e3bab0fd-121a-4c18-bd4b-c5c86ab2a363_New-Territory-PNG_Ambiente.webp',
        linkedVehicle: 'New Level Territory',
        linkedModel: 'Ambiente',
        slug: '16299-new-level-territory-1.8-ambiente-auto',
        specialOffer: 489900,
        bestSaving: 45000,
        linkedVariant: 'territory-18t-ambiente',
      },
      {
        offerType: 'price-point',
        labelOverride: 'New Level Territory 1.8 Trend Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/16300-new-level-territory-1.8-trend-auto/images/16300-496b040b-c87d-4faa-b31c-b878fca9060b3adf266a-2d07-440e-abff-65fa87b0e619_New-Territory-PNG_Trend.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/16300-new-level-territory-1.8-trend-auto/images/16300-496b040b-c87d-4faa-b31c-b878fca9060b3adf266a-2d07-440e-abff-65fa87b0e619_New-Territory-PNG_Trend.webp',
        linkedVehicle: 'New Level Territory',
        slug: '16300-new-level-territory-1.8-trend-auto',
        linkedModel: 'Trend',
        specialOffer: 539900,
        bestSaving: 45000,
        linkedVariant: 'territory-18t-trend',
      },
      {
        offerType: 'payment',
        labelOverride: 'New Level Territory 1.8 Trend Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/17873-new-level-territory-1.8-trend-auto/images/17873-0b501672-e843-4e7c-9192-a460867b7f91e36db99c-938c-48ac-9ce9-8182d5cdfe07_f0265575-9ca7-4191-ac57-17599485b10c.png',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17873-new-level-territory-1.8-trend-auto/images/17873-0b501672-e843-4e7c-9192-a460867b7f91e36db99c-938c-48ac-9ce9-8182d5cdfe07_f0265575-9ca7-4191-ac57-17599485b10c.png',
        linkedVehicle: 'New Level Territory',
        linkedModel: 'Trend',
        slug: '17873-new-level-territory-1.8-trend-auto',
        paymentFrom: 7899,
        linkedVariant: 'territory-18t-trend',
      },
      {
        offerType: 'payment',
        labelOverride: 'New Level Territory 1.8 Ambiente Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/17872-new-level-territory-1.8-ambiente-auto/images/17872-eb00131e-7e03-43f1-8045-e5f718e6789b6a857165-18bc-4748-818a-12bac8c20a27_b6da7bbd-22d7-4166-a8c9-1a7213fcaa9b.png',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17872-new-level-territory-1.8-ambiente-auto/images/17872-eb00131e-7e03-43f1-8045-e5f718e6789b6a857165-18bc-4748-818a-12bac8c20a27_b6da7bbd-22d7-4166-a8c9-1a7213fcaa9b.png',
        linkedVehicle: 'New Level Territory',
        linkedModel: 'Ambiente',
        slug: '17872-new-level-territory-1.8-ambiente-auto',
        paymentFrom: 7299,
        linkedVariant: 'territory-18t-ambiente',
      },
      {
        offerType: 'price-point',
        labelOverride: 'New Level Territory 1.8 Titanium Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/16301-new-level-territory-1.8-titanium-auto/images/16301-a3d62bf3-d3b0-4d3b-89d5-86cbf49b7273e85c250f-5466-4a4a-828b-cc421a93eead_New-Territory-PNG_Titanium.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/16301-new-level-territory-1.8-titanium-auto/images/16301-a3d62bf3-d3b0-4d3b-89d5-86cbf49b7273e85c250f-5466-4a4a-828b-cc421a93eead_New-Territory-PNG_Titanium.webp',
        linkedVehicle: 'New Level Territory',
        slug: '16301-new-level-territory-1.8-titanium-auto',
        linkedModel: 'Titanium',
        specialOffer: 599900,
        bestSaving: 44000,
        linkedVariant: '18t-titanium',
      },
      {
        offerType: 'payment',
        labelOverride: 'New Level Territory 1.8 Titanium Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/17875-new-level-territory-1.8-titanium-auto/images/17875-5d3926ef-f8fa-4286-978c-fbcd0cf79061f295218b-3115-43ab-bf4a-0e768cff958e_download.png',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17875-new-level-territory-1.8-titanium-auto/images/17875-5d3926ef-f8fa-4286-978c-fbcd0cf79061f295218b-3115-43ab-bf4a-0e768cff958e_download.png',
        linkedVehicle: 'New Level Territory',
        linkedModel: 'Titanium',
        slug: '17875-new-level-territory-1.8-titanium-auto',
        paymentFrom: 8699,
        linkedVariant: '18t-titanium',
      },
    ],
  },
  {
    specialsCategory: 'Everest Specials',
    specials: [
      {
        offerType: 'price-point',
        labelOverride: 'Everest 2.0 SiT Active 4x2 Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/17882-everest-2.0-sit-active-4x2-auto/images/17882-8c8a1317-7952-4e0d-b9dd-b21890559a970f0da576-eac2-4592-af21-689a87c901a3_active-snow-flake-white-01.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17882-everest-2.0-sit-active-4x2-auto/images/17882-8c8a1317-7952-4e0d-b9dd-b21890559a970f0da576-eac2-4592-af21-689a87c901a3_active-snow-flake-white-01.webp',
        linkedVehicle: 'Next Level Everest',
        linkedModel: 'Active',
        slug: '17882-everest-2.0-sit-active-4x2-auto',
        specialOffer: 779900,
        bestSaving: 45100,
        linkedVariant: '20-sit-active-4x2-10at',
      },
      {
        offerType: 'payment',
        labelOverride: 'Everest 2.0L SiT ACTIVE 10AT 4X2',
        cardImage:
          'https://www.eagleford.co.za/specials/18384-everest-2.0l-sit-active-10at-4x2/images/18384-10ed4d51-7b63-4333-b6c8-fe4009ed82816281b866-f7af-43d4-8ec2-3520a48fc588_download.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/18384-everest-2.0l-sit-active-10at-4x2/images/18384-10ed4d51-7b63-4333-b6c8-fe4009ed82816281b866-f7af-43d4-8ec2-3520a48fc588_download.webp',
        linkedVehicle: 'Next Level Everest',
        linkedModel: 'Active',
        slug: '18384-everest-2.0l-sit-active-10at-4x2',
        paymentFrom: 11199,
        linkedVariant: '20-sit-active-4x2-10at',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Everest 2.0 SiT Active 4x4 Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/17883-everest-2.0-sit-active-4x4-auto/images/17883-06b6735c-b570-4ebf-9314-8787c9f9dc8475ddc090-d794-4f47-9521-7f8a06d7c755_active-arctic-white-01.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17883-everest-2.0-sit-active-4x4-auto/images/17883-06b6735c-b570-4ebf-9314-8787c9f9dc8475ddc090-d794-4f47-9521-7f8a06d7c755_active-arctic-white-01.webp',
        linkedVehicle: 'Next Level Everest',
        linkedModel: 'Active',
        slug: '17883-everest-2.0-sit-active-4x4-auto',
        specialOffer: 834900,
        bestSaving: 40100,
        linkedVariant: '20-sit-active-4x2-10at',
      },
      {
        offerType: 'payment',
        labelOverride: 'Everest 2.0L SiT ACTIVE 10AT 4X4',
        cardImage:
          'https://www.eagleford.co.za/specials/18385-everest-2.0l-sit-active-10at-4x4/images/18385-bc48f800-d7e3-4f46-9115-59b163f1761e58ef278a-5f34-4611-bc34-cd24fcee8bf4_847a2cfe-9c1f-4b98-95c5-955281fe9262.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/18385-everest-2.0l-sit-active-10at-4x4/images/18385-bc48f800-d7e3-4f46-9115-59b163f1761e58ef278a-5f34-4611-bc34-cd24fcee8bf4_847a2cfe-9c1f-4b98-95c5-955281fe9262.webp',
        linkedVehicle: 'Next Level Everest',
        linkedModel: 'Active',
        slug: '18385-everest-2.0l-sit-active-10at-4x4',
        paymentFrom: 11899,
        linkedVariant: '20-sit-active-4x2-10at',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Everest 3.0 V6 4x4 Sport Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/17884-everest-3.0-v6-4x4-sport-auto/images/17884-06a59112-428f-49a4-b63d-52bc89e1a59bf58ea2dc-e841-4d7a-a397-eb7b7531803b_active-aluminium-01.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17884-everest-3.0-v6-4x4-sport-auto/images/17884-06a59112-428f-49a4-b63d-52bc89e1a59bf58ea2dc-e841-4d7a-a397-eb7b7531803b_active-aluminium-01.webp',
        linkedVehicle: 'Next Level Everest',
        linkedModel: 'Sport',
        slug: '17884-everest-3.0-v6-4x4-sport-auto',
        specialOffer: 1059900,
        bestSaving: 89100,
        linkedVariant: '30-v6-sport-4x4-10at',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Everest 3.0 V6 Wildtrak 4x4 DC Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/17885-everest-3.0-v6-wildtrak-4x4-dc-auto/images/17885-7364ec31-0167-472f-be70-ca639f93b08aa608ddcd-4305-40c7-b838-a6a3dac395af_active-aluminium-01--1-.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17885-everest-3.0-v6-wildtrak-4x4-dc-auto/images/17885-7364ec31-0167-472f-be70-ca639f93b08aa608ddcd-4305-40c7-b838-a6a3dac395af_active-aluminium-01--1-.webp',
        linkedVehicle: 'Next Level Everest',
        linkedModel: 'Wildtrak',
        slug: '17885-everest-3.0-v6-wildtrak-4x4-dc-auto',
        specialOffer: 1129900,
        bestSaving: 114100,
        linkedVariant: '30-v6-wildtrak-4x4-10at',
      },
      {
        offerType: 'payment',
        labelOverride: 'Everest 3.0L V6 SPORT 10AT 4X4',
        cardImage:
          'https://www.eagleford.co.za/specials/18386-everest-3.0l-v6-sport-10at-4x4/images/18386-2e484007-1138-49c7-b71a-7b58b35f190fa1e38f50-27b4-4853-a53f-a2c76808dc62_223f3861-1254-4034-9b1e-8f6015e06504.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/18386-everest-3.0l-v6-sport-10at-4x4/images/18386-2e484007-1138-49c7-b71a-7b58b35f190fa1e38f50-27b4-4853-a53f-a2c76808dc62_223f3861-1254-4034-9b1e-8f6015e06504.webp',
        linkedVehicle: 'Next Level Everest',
        linkedModel: 'Sport',
        slug: '18386-everest-3.0l-v6-sport-10at-4x4',
        paymentFrom: 15699,
        linkedVariant: '30-v6-sport-4x4-10at',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Everest 3.0 V6 Platinum Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/18394-everest-3.0-v6-platinum-auto/images/18394-fd299fb2-1666-4830-96a0-369f5cdfd6a8472b7a36-17a3-479d-a43f-cd5efe382fe4_3d9deee8-3029-47be-a20c-13411c784077.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/18394-everest-3.0-v6-platinum-auto/images/18394-fd299fb2-1666-4830-96a0-369f5cdfd6a8472b7a36-17a3-479d-a43f-cd5efe382fe4_3d9deee8-3029-47be-a20c-13411c784077.webp',
        linkedVehicle: 'Next Level Everest',
        linkedModel: 'Platinum',
        slug: '18394-everest-3.0-v6-platinum-auto',
        specialOffer: 1219900,
        bestSaving: 120100,
        linkedVariant: '30-v6-platinum-4x4-10at',
      },
      {
        offerType: 'payment',
        labelOverride: 'Everest 3.0L V6 WILDTRAK 10AT 4X4',
        cardImage:
          'https://www.eagleford.co.za/specials/18387-everest-3.0l-v6-wildtrak-10at-4x4/images/18387-9025dd3b-8354-467c-920f-50ec73528ce392a725d2-c143-4ed1-bef8-de00eda06a54_52e0f5ad-8565-4603-90a8-8ac82774e0ee.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/18387-everest-3.0l-v6-wildtrak-10at-4x4/images/18387-9025dd3b-8354-467c-920f-50ec73528ce392a725d2-c143-4ed1-bef8-de00eda06a54_52e0f5ad-8565-4603-90a8-8ac82774e0ee.webp',
        linkedVehicle: 'Next Level Everest',
        linkedModel: 'Wildtrak',
        slug: '18387-everest-3.0l-v6-wildtrak-10at-4x4',
        paymentFrom: 16599,
        linkedVariant: '30-v6-wildtrak-4x4-10at',
      },
      {
        offerType: 'payment',
        labelOverride: 'Everest 3.0L V6 PLATINUM 10AT 4X4',
        cardImage:
          'https://www.eagleford.co.za/specials/18388-everest-3.0l-v6-platinum-10at-4x4/images/18388-9df2e6d8-c9b1-4598-a36b-aad80ca7070908db4f1b-33d4-4bb8-ba5c-fcf6621ed054_download.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/18388-everest-3.0l-v6-platinum-10at-4x4/images/18388-9df2e6d8-c9b1-4598-a36b-aad80ca7070908db4f1b-33d4-4bb8-ba5c-fcf6621ed054_download.webp',
        linkedVehicle: 'Next Level Everest',
        linkedModel: 'Platinum',
        slug: '18388-everest-3.0l-v6-platinum-10at-4x4',
        paymentFrom: 17999,
        linkedVariant: '30-v6-platinum-4x4-10at',
      },
    ],
  },
  {
    specialsCategory: 'Ranger Raptor Specials',
    specials: [
      {
        offerType: 'price-point',
        labelOverride: 'Ranger 3.0 V6 Petrol Raptor',
        cardImage:
          'https://www.eagleford.co.za/specials/12651-ranger-3.0-v6-petrol-raptor/images/12651-7ccbf218-831b-4029-9cdc-75ae3737337cbd893d7b-5756-4c74-9436-f68beb58cd7a_Ranger-Raptor-700x340-.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/12651-ranger-3.0-v6-petrol-raptor/images/12651-7ccbf218-831b-4029-9cdc-75ae3737337cbd893d7b-5756-4c74-9436-f68beb58cd7a_Ranger-Raptor-700x340-.webp',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Raptor',
        slug: '12651-ranger-3.0-v6-petrol-raptor',
        specialOffer: 1239900,
        bestSaving: 67400,
        linkedVariant: '30l-v6-tt-double-cab-raptor-4x4-10at',
      },
      {
        offerType: 'payment',
        labelOverride: 'RANGER 3.0L V6 ECOBOOST RAPTOR 4WD 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/17908-ranger-3.0l-v6-ecoboost-raptor-4wd-10at/images/17908-6267a5f1-d1e3-429f-bf64-dea781c093dc830b8391-0bb2-4e2e-84ee-7c8b00922fb5_26MY_IMG_JB_P703_RANRAP_RPTR_DOUBLECAB_ARCWHI_ANGLE21_RHD_4X4.png',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17908-ranger-3.0l-v6-ecoboost-raptor-4wd-10at/images/17908-6267a5f1-d1e3-429f-bf64-dea781c093dc830b8391-0bb2-4e2e-84ee-7c8b00922fb5_26MY_IMG_JB_P703_RANRAP_RPTR_DOUBLECAB_ARCWHI_ANGLE21_RHD_4X4.png',
        linkedVehicle: 'Next Level Ranger',
        linkedModel: 'Ranger Raptor',
        slug: '17908-ranger-3.0l-v6-ecoboost-raptor-4wd-10at',
        paymentFrom: 19399,
        linkedVariant: '30l-v6-tt-double-cab-raptor-4x4-10at',
      },
    ],
  },
  {
    specialsCategory: 'Mustang Specials',
    specials: [
      {
        offerType: 'payment',
        labelOverride: 'MUSTANG 5.0 GT FASTBACK 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/12778-mustang-5.0-gt-fastback-10at/images/12778-14b06fee-bded-48d7-a6c3-ac92cb32483345641573-5a5a-400e-bb36-c1783fb8709d_Mustang-GT-700x340-.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/12778-mustang-5.0-gt-fastback-10at/images/12778-14b06fee-bded-48d7-a6c3-ac92cb32483345641573-5a5a-400e-bb36-c1783fb8709d_Mustang-GT-700x340-.webp',
        linkedVehicle: 'Mustang',
        linkedModel: 'Mustang GT',
        slug: '12778-mustang-5.0-gt-fastback-10at',
        paymentFrom: 19999,
        linkedVariant: 'Mustang GT',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Mustang Dark Horse',
        cardImage:
          'https://www.eagleford.co.za/specials/17862-mustang-dark-horse/images/17862-5bbe1ab8-cae6-4067-8954-85e9ffcab6daa5dac075-4205-4e99-8df0-76e620b6ffcb_download.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/17862-mustang-dark-horse/images/17862-5bbe1ab8-cae6-4067-8954-85e9ffcab6daa5dac075-4205-4e99-8df0-76e620b6ffcb_download.webp',
        linkedVehicle: 'Mustang',
        linkedModel: 'Mustang Dark Horse',
        slug: '17862-mustang-dark-horse',
        specialOffer: 1399900,
        bestSaving: 145100,
        linkedVariant: 'Mustang Dark Horse',
      },
      {
        offerType: 'payment',
        labelOverride: 'MUSTANG DARK HORSE 10AT',
        cardImage:
          'https://www.eagleford.co.za/specials/12779-mustang-dark-horse-10at/images/12779-bf2cc23a-a3a3-49a0-b466-6a04e95577188e6e0094-53c0-4ece-b04b-0f750a8da416_Mustang-Dark-Horse-700x340-.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/12779-mustang-dark-horse-10at/images/12779-bf2cc23a-a3a3-49a0-b466-6a04e95577188e6e0094-53c0-4ece-b04b-0f750a8da416_Mustang-Dark-Horse-700x340-.webp',
        linkedVehicle: 'Mustang',
        linkedModel: 'Mustang Dark Horse',
        slug: '12779-mustang-dark-horse-10at',
        paymentFrom: 22999,
        linkedVariant: 'Mustang Dark Horse',
      },
    ],
  },
  {
    specialsCategory: 'Transit Custom Specials',
    specials: [
      {
        offerType: 'price-point',
        labelOverride: 'Ford Transit Van LWB Manual',
        cardImage:
          'https://www.eagleford.co.za/specials/12804-ford-transit-van-lwb-manual/images/12804-d6065bea-4f35-40ad-a7f7-c0848779c42ffd9d8b83-8d6b-442c-af57-d878f01bd4e0_Transit-Custom-700x340-.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/12804-ford-transit-van-lwb-manual/images/12804-d6065bea-4f35-40ad-a7f7-c0848779c42ffd9d8b83-8d6b-442c-af57-d878f01bd4e0_Transit-Custom-700x340-.webp',
        linkedVehicle: 'New Transit Custom',
        linkedModel: 'Base',
        slug: '12804-ford-transit-van-lwb-manual',
        specialOffer: 659900,
        bestSaving: 120850,
        linkedVariant: 'transit-custom-20l-lwb-van-base-6mt',
      },
    ],
  },
  {
    specialsCategory: 'Tourneo Custom Specials',
    specials: [
      {
        offerType: 'price-point',
        labelOverride: 'Tourneo 2.0 Trend Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/16395-tourneo-2.0-trend-auto/images/16395-13b92216-3753-48cb-8b97-c47e64af5c42649883be-9049-42cc-8cbd-3d9ef4a2f1e6_Tourneo-Custom-700x340-.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/16395-tourneo-2.0-trend-auto/images/16395-13b92216-3753-48cb-8b97-c47e64af5c42649883be-9049-42cc-8cbd-3d9ef4a2f1e6_Tourneo-Custom-700x340-.webp',
        linkedVehicle: 'New Tourneo Custom',
        slug: '16395-tourneo-2.0-trend-auto',
        linkedModel: 'Trend',
        specialOffer: 969900,
        bestSaving: 152050,
        linkedVariant: 'Tourneo Trend',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Tourneo Active LWB Bus Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/16394-tourneo-active-lwb-bus-auto/images/16394-b736f56e-6dd8-478a-862d-0febcd45c299898bb4c6-e2cd-42b1-ba86-5b4348f1ea7e_Tourneo-700x340-.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/16394-tourneo-active-lwb-bus-auto/images/16394-b736f56e-6dd8-478a-862d-0febcd45c299898bb4c6-e2cd-42b1-ba86-5b4348f1ea7e_Tourneo-700x340-.webp',
        linkedVehicle: 'New Tourneo Custom',
        linkedModel: 'Trend',
        slug: '16394-tourneo-active-lwb-bus-auto',
        specialOffer: 1015900,
        bestSaving: 64050,
        linkedVariant: 'tourneo-active',
      },
      {
        offerType: 'payment',
        labelOverride: 'Tourneo Custom 2.0L LWB BUS TREND 8AT',
        cardImage:
          'https://www.eagleford.co.za/specials/14774-tourneo-custom-2.0l-lwb-bus-trend-8at/images/14774-853c01b9-14aa-450b-8fd2-4cafee8b19eaf128bd06-1454-4dc3-a470-9198296ed96a_Tourneo-Custom-700x340-.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/14774-tourneo-custom-2.0l-lwb-bus-trend-8at/images/14774-853c01b9-14aa-450b-8fd2-4cafee8b19eaf128bd06-1454-4dc3-a470-9198296ed96a_Tourneo-Custom-700x340-.webp',
        linkedVehicle: 'New Tourneo Custom',
        linkedModel: 'Trend',
        slug: '14774-tourneo-custom-2.0l-lwb-bus-trend-8at',
        paymentFrom: 14599,
        linkedVariant: 'Tourneo Trend',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Tourneo 2.0 Sport Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/16397-tourneo-2.0-sport-auto/images/16397-6daca8a8-7f64-4218-8fc8-2b8aeaed8e69ab3d6dcd-1d7c-4c9a-a7b1-ea9b88fbee56_Transit-Custom-700x340---1-.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/16397-tourneo-2.0-sport-auto/images/16397-6daca8a8-7f64-4218-8fc8-2b8aeaed8e69ab3d6dcd-1d7c-4c9a-a7b1-ea9b88fbee56_Transit-Custom-700x340---1-.webp',
        linkedVehicle: 'New Tourneo Custom',
        linkedModel: 'Sport',
        slug: '16397-tourneo-2.0-sport-auto',
        specialOffer: 1125000,
        bestSaving: 107000,
        linkedVariant: 'Tourneo Sport',
      },
      {
        offerType: 'payment',
        labelOverride: 'TOURNEO CUSTOM 2.0L SWB BUS SPORT 8AT',
        cardImage:
          'https://www.eagleford.co.za/specials/12806-tourneo-custom-2.0l-swb-bus-sport-8at/images/12806-0cb0aa79-e538-4443-a26b-22d5d01728fd48fe7831-576e-4d47-8313-92297b840dd0_download.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/12806-tourneo-custom-2.0l-swb-bus-sport-8at/images/12806-0cb0aa79-e538-4443-a26b-22d5d01728fd48fe7831-576e-4d47-8313-92297b840dd0_download.webp',
        linkedVehicle: 'New Tourneo Custom',
        linkedModel: 'Sport',
        slug: '12806-tourneo-custom-2.0l-swb-bus-sport-8at',
        paymentFrom: 18299,
        linkedVariant: 'Tourneo Sport',
      },
      {
        offerType: 'price-point',
        labelOverride: 'Tourneo Titanium X Auto',
        cardImage:
          'https://www.eagleford.co.za/specials/16396-tourneo-titanium-x-auto/images/16396-77b0802c-2314-4fc7-9289-8eae4246f04e8c94cea6-5dc6-4d7f-864d-712aa30be344_Tourneo-700x340---1-.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/16396-tourneo-titanium-x-auto/images/16396-77b0802c-2314-4fc7-9289-8eae4246f04e8c94cea6-5dc6-4d7f-864d-712aa30be344_Tourneo-700x340---1-.webp',
        linkedVehicle: 'New Tourneo Custom',
        linkedModel: 'Titanium',
        slug: '16396-tourneo-titanium-x-auto',
        specialOffer: 1210900,
        bestSaving: 67600,
        linkedVariant: 'Tourneo Titanium X',
      },
      {
        offerType: 'payment',
        labelOverride: 'Tourneo Custom 2.0L SWB TITANIUM X 8AT',
        cardImage:
          'https://www.eagleford.co.za/specials/14775-tourneo-custom-2.0l-swb-titanium-x-8at/images/14775-68384505-2f7b-4e99-9f11-a79407bf1aeaf66405f1-7757-431c-a4dc-12102d40302b_Tourneo-700x340---1-.webp',
        detailImageUrl:
          'https://www.eagleford.co.za/specials/14775-tourneo-custom-2.0l-swb-titanium-x-8at/images/14775-68384505-2f7b-4e99-9f11-a79407bf1aeaf66405f1-7757-431c-a4dc-12102d40302b_Tourneo-700x340---1-.webp',
        linkedVehicle: 'New Tourneo Custom',
        linkedModel: 'Titanium',
        slug: '14775-tourneo-custom-2.0l-swb-titanium-x-8at',
        paymentFrom: 18999,
        linkedVariant: 'Tourneo Titanium X',
      },
    ],
  },
]

export const SPECIALS_SEED_DATA: SpecialSeedEntry[] = DATA.flatMap((category) =>
  category.specials.map((special, index) => ({
    ...special,
    specialsCategory: category.specialsCategory,
    sortOrder: index + 1,
  })),
)
