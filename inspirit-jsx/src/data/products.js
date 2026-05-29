const u = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=85&auto=format&fit=crop`;
export const PRODUCTS = [
    {
        id: 'p01', slug: 'crimson-rage-jersey', name: 'Crimson Rage Jersey', category: 'Jerseys',
        price: 189, oldPrice: 240, rating: 4.9, reviews: 218, badge: 'LIMITED',
        colors: ['#b91c1c', '#0a0a0a'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        images: [u('1521572163474-6864f9cf17ab'), u('1503341504253-dff4815485f1'), u('1556821840-3a63f95609a7')],
        description: 'A signature streetwear jersey cut from heavyweight mesh with embroidered blood-red insignia. Built for the rebellion.',
        tag: 'INSPIRIT 01',
    },
    {
        id: 'p02', slug: 'obsidian-oversized-tee', name: 'Obsidian Oversized Tee', category: 'T-Shirts',
        price: 79, rating: 4.8, reviews: 412, badge: 'TRENDING',
        colors: ['#0a0a0a', '#f5f5f4'], sizes: ['S', 'M', 'L', 'XL'],
        images: [u('1521572163474-6864f9cf17ab'), u('1583743814966-8936f5b7be1a'), u('1622445275576-721325763afe')],
        description: 'Boxy 280gsm cotton drop-shoulder with raw-edge ember stitching. Worn loose, worn loud.',
    },
    {
        id: 'p03', slug: 'midnight-cargo-pants', name: 'Midnight Cargo Pants', category: 'Pants',
        price: 159, rating: 4.7, reviews: 96, badge: 'NEW',
        colors: ['#0a0a0a', '#3f3f46'], sizes: ['28', '30', '32', '34', '36'],
        images: [u('1473966968600-fa801b869a1a'), u('1542272604-787c3835535d'), u('1604176354204-9268737828e4')],
        description: 'Tactical cargo silhouette with utility pockets, articulated knees and reinforced crimson topstitch.',
    },
    {
        id: 'p04', slug: 'ember-button-shirt', name: 'Ember Button Shirt', category: 'Shirts',
        price: 139, rating: 4.6, reviews: 73,
        colors: ['#dc2626', '#0a0a0a', '#f5f5f4'], sizes: ['S', 'M', 'L', 'XL'],
        images: [u('1602810318383-e386cc2a3ccf'), u('1620799140408-edc6dcb6d633'), u('1596755094514-f87e34085b2c')],
        description: 'Crepe-finish overshirt cut in our signature blood-tone. Mother-of-pearl buttons, dropped hem.',
    },
    {
        id: 'p05', slug: 'phantom-graphic-tee', name: 'Phantom Graphic Tee', category: 'T-Shirts',
        price: 89, oldPrice: 110, rating: 4.9, reviews: 532, badge: 'SALE',
        colors: ['#0a0a0a'], sizes: ['S', 'M', 'L', 'XL'],
        images: [u('1576566588028-4147f3842f27'), u('1503341455253-b2e723bb3dbb'), u('1583743814966-8936f5b7be1a')],
        description: 'Discharge-printed phantom graphic on heavyweight black. Each piece wears in differently.',
    },
    {
        id: 'p06', slug: 'arena-stripe-jersey', name: 'Arena Stripe Jersey', category: 'Jerseys',
        price: 169, rating: 4.7, reviews: 184, badge: 'NEW',
        colors: ['#b91c1c', '#f5f5f4'], sizes: ['S', 'M', 'L', 'XL'],
        images: [u('1556821840-3a63f95609a7'), u('1521572163474-6864f9cf17ab'), u('1606107557195-0e29a4b5b4aa')],
        description: 'Knit jersey with signature INSPIRIT side striping. Game-day silhouette, runway weight.',
    },
    {
        id: 'p07', slug: 'silhouette-wide-pant', name: 'Silhouette Wide Pant', category: 'Pants',
        price: 179, rating: 4.8, reviews: 142, badge: 'TRENDING',
        colors: ['#0a0a0a', '#f5f5f4'], sizes: ['28', '30', '32', '34'],
        images: [u('1594633312681-425c7b97ccd1'), u('1542272604-787c3835535d'), u('1473966968600-fa801b869a1a')],
        description: 'Architectural wide-leg trouser in compact twill. Pleated fronts. Brutalist drape.',
    },
    {
        id: 'p08', slug: 'noir-mock-tee', name: 'Noir Mock Tee', category: 'T-Shirts',
        price: 95, rating: 4.5, reviews: 67,
        colors: ['#0a0a0a'], sizes: ['S', 'M', 'L', 'XL'],
        images: [u('1622445275576-721325763afe'), u('1576566588028-4147f3842f27'), u('1583743814966-8936f5b7be1a')],
        description: 'Long-sleeve mock-neck in 320gsm interlock cotton. Minimal, monastic, monolithic.',
    },
    {
        id: 'p09', slug: 'ritual-flannel-shirt', name: 'Ritual Flannel Shirt', category: 'Shirts',
        price: 145, oldPrice: 180, rating: 4.6, reviews: 88, badge: 'SALE',
        colors: ['#7f1d1d', '#0a0a0a'], sizes: ['S', 'M', 'L', 'XL'],
        images: [u('1620799140408-edc6dcb6d633'), u('1602810318383-e386cc2a3ccf'), u('1596755094514-f87e34085b2c')],
        description: 'Brushed flannel overshirt in a midnight-blood plaid. Heavy weight, ritual cut.',
    },
    {
        id: 'p10', slug: 'crimson-track-pant', name: 'Crimson Track Pant', category: 'Pants',
        price: 129, rating: 4.7, reviews: 201, badge: 'TRENDING',
        colors: ['#b91c1c', '#0a0a0a'], sizes: ['S', 'M', 'L', 'XL'],
        images: [u('1604176354204-9268737828e4'), u('1542272604-787c3835535d'), u('1594633312681-425c7b97ccd1')],
        description: 'Tapered track pant with mesh inserts and reflective heat-seal taping.',
    },
    {
        id: 'p11', slug: 'cathedral-jersey', name: 'Cathedral Jersey', category: 'Jerseys',
        price: 199, rating: 5.0, reviews: 58, badge: 'LIMITED',
        colors: ['#0a0a0a', '#b91c1c'], sizes: ['S', 'M', 'L', 'XL'],
        images: [u('1606107557195-0e29a4b5b4aa'), u('1521572163474-6864f9cf17ab'), u('1556821840-3a63f95609a7')],
        description: 'Cathedral-print mesh jersey. Numbered run of 300. Each comes with a foil-stamped certificate.',
    },
    {
        id: 'p12', slug: 'monolith-button-up', name: 'Monolith Button Up', category: 'Shirts',
        price: 155, rating: 4.7, reviews: 102, badge: 'NEW',
        colors: ['#f5f5f4', '#0a0a0a'], sizes: ['S', 'M', 'L', 'XL'],
        images: [u('1596755094514-f87e34085b2c'), u('1620799140408-edc6dcb6d633'), u('1602810318383-e386cc2a3ccf')],
        description: 'Crisp poplin button-up with concealed placket and tonal embroidery at the back yoke.',
    },
];
export const CATEGORIES = [
    { key: 'Jerseys', label: 'Jerseys', image: u('1556821840-3a63f95609a7', 900) },
    { key: 'Shirts', label: 'Shirts', image: u('1620799140408-edc6dcb6d633', 900) },
    { key: 'T-Shirts', label: 'T-Shirts', image: u('1583743814966-8936f5b7be1a', 900) },
    { key: 'Pants', label: 'Pants', image: u('1594633312681-425c7b97ccd1', 900) },
];
export const TESTIMONIALS = [
    { name: 'Dhanush', city: 'Ashok Nagar', text: 'INSPIRIT pieces fit like couture but hit like the street. Nothing else feels like this.', rating: 5 },
    { name: 'Suriya Prakash', city: 'Kodambakkam', text: 'The weight, the cut, the red. Every drop is an event. I plan my week around the release.', rating: 5 },
    { name: 'Harish', city: 'T.Nagar', text: "I bought one jersey and replaced half my wardrobe. The craftsmanship is genuinely insane.", rating: 5 },
    { name: 'Bala', city: 'Tambaram', text: 'Worn it through three winters. Still looks like it just left the studio.', rating: 5 },
];
export const findProduct = (slug) => PRODUCTS.find(p => p.slug === slug);
