
export const productsSeed = [
    // SALGADOS
    {
        name: "Torta de Frango com Bacon",
        description: "Torta cremosa e suculenta.",
        price: 9.00,
        category: "Salgados",
        image: "torta.jpg",
        image_type: "local"
    },
    {
        name: "Cigarrete",
        description: "Salgado clássico crocante.",
        price: 9.00,
        category: "Salgados",
        image: "cigarrete.jpg",
        image_type: "local"
    },
    {
        name: "Coxinha Grande",
        description: "A queridinha do Brasil, bem recheada.",
        price: 9.00,
        category: "Salgados",
        image: "coxinha.png",
        image_type: "local"
    },
    {
        name: "Coxinha Pequena (Unid)",
        description: "Perfeita para um lanche rápido.",
        price: 2.00,
        category: "Salgados",
        image: "coxinha.png",
        image_type: "local"
    },
    {
        name: "Combo 5 Coxinhas",
        description: "5 unidades de coxinha pequena.",
        price: 9.90,
        category: "Salgados",
        image: "coxinha.png",
        image_type: "local"
    },
    {
        name: "Hambúrguete",
        description: "Salgado assado tipo hambúrguer.",
        price: 12.00,
        category: "Salgados",
        image: "Hambúrguete.jpg",
        image_type: "local"
    },
    {
        name: "Pizza Frango e Calabresa",
        description: "Fatia ou mini pizza saborosa.",
        price: 9.00,
        category: "Salgados",
        image: "pizza.jpg",
        image_type: "local"
    },
    {
        name: "Pão de Queijo",
        description: "Tradicional mineiro.",
        price: 6.00,
        category: "Salgados",
        image: "pao_de_queijo.jpg",
        image_type: "local"
    },
    {
        name: "Pão de Queijo com Carne",
        description: "Recheado com patinho.",
        price: 9.00,
        category: "Salgados",
        image: "pao_de_queijo.jpg",
        image_type: "local"
    },
    {
        name: "Hambúrguer Artesanal",
        description: "Sabor autêntico e suculento.",
        price: 12.00,
        category: "Salgados",
        image: "burger.jpg",
        image_type: "local"
    },

    // BEBIDAS
    {
        name: "Kapo",
        description: "Suco de caixinha refrescante.",
        price: 5.00,
        category: "Bebidas",
        image: "kapo.png",
        image_type: "local",
        options: ["Morango", "Uva", "Laranja", "Abacaxi", "Maracujá"]
    },
    {
        name: "Refrigerante",
        description: "Lata 350ml variados.",
        price: 4.00,
        category: "Bebidas",
        image: "Refrigerante.jpg",
        image_type: "local"
    },
    {
        name: "Água de Coco",
        description: "Natural e hidratante.",
        price: 5.00,
        category: "Bebidas",
        image: "agua-coco.jpg",
        image_type: "local"
    },
    {
        name: "Suco Tial",
        description: "Suco de néctar de frutas.",
        price: 5.00,
        category: "Bebidas",
        image: "suco_tial.jpg",
        image_type: "local",
        options: ["Uva", "Pêssego", "Goiaba", "Manga", "Maracujá"]
    },
    {
        name: "Gatorade",
        description: "Isotônico para repor as energias.",
        price: 9.00,
        category: "Bebidas",
        image: "Gatorade.jpg",
        image_type: "local"
    },
    {
        name: "Sprite",
        description: "Refrigerante de limão.",
        price: 7.00,
        category: "Bebidas",
        image: "sprite.jpg",
        image_type: "local"
    },
    {
        name: "Água Mineral",
        description: "Sem gás.",
        price: 4.00,
        category: "Bebidas",
        image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80",
        image_type: "url"
    },
    {
        name: "Suco Natural",
        description: "Laranja, Limão, Maracujá ou Uva Integral.",
        price: 6.00,
        category: "Bebidas",
        image: "Suco_Natural.jpg",
        image_type: "local",
        options: ["Laranja", "Limão", "Maracujá", "Uva Integral"]
    },

    // DOCES
    {
        name: "Bala Caramelo",
        description: "Doce de leite.",
        price: 0.75,
        category: "Doces",
        image: "bala_caramelo.jpg",
        image_type: "local"
    },
    {
        name: "Batom",
        description: "Chocolate ao leite.",
        price: 3.50,
        category: "Doces",
        image: "batom.jpg",
        image_type: "local"
    },
    {
        name: "Bis",
        description: "Unidade crocante.",
        price: 1.00,
        category: "Doces",
        image: "bis.jpg",
        image_type: "local"
    },
    {
        name: "KitKat",
        description: "Wafer coberto com chocolate.",
        price: 6.50,
        category: "Doces",
        image: "kitkat.jpg",
        image_type: "local"
    },
    {
        name: "Trento",
        description: "Chocolate com wafer.",
        price: 4.50,
        category: "Doces",
        image: "Trento.jpg",
        image_type: "local"
    },
    {
        name: "Barra de Cereal",
        description: "Opção saudável.",
        price: 5.00,
        category: "Doces",
        image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=60",
        image_type: "url"
    },
    {
        name: "Bolinho Bauducco",
        description: "Recheado e macio.",
        price: 5.00,
        category: "Doces",
        image: "bolinho_Bauduco.jpg",
        image_type: "local"
    },
    {
        name: "Fini",
        description: "Balas de gelatina.",
        price: 3.50,
        category: "Doces",
        image: "fini.jpg",
        image_type: "local"
    },
    {
        name: "Lacta",
        description: "Chocolate em barra ou bombom.",
        price: 5.50,
        category: "Doces",
        image: "batom.jpg", // Using placeholder/similar image as specific one wasn't clear
        image_type: "local"
    },
    {
        name: "Bolo de Chocolate",
        description: "Fatia caseira.",
        price: 6.00,
        category: "Doces",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        image_type: "url"
    },
    {
        name: "Brownie",
        description: "Denso e chocolatudo.",
        price: 9.00,
        category: "Doces",
        image: "Brownie.jpg",
        image_type: "local"
    },
    {
        name: "Bolo de Pote",
        description: "Vários sabores, bem recheado.",
        price: 12.00,
        category: "Doces",
        image: "Bolo_de_Pote.jpg",
        image_type: "local",
        options: ["Brigadeiro", "Leite Ninho", "Prestígio", "Cenoura com Chocolate", "Maracujá", "Limão"]
    },
    {
        name: "Cupcake",
        description: "Bolinho decorado e recheado.",
        price: 9.00,
        category: "Doces",
        image: "Cupcake.jpg",
        image_type: "local"
    },
    {
        name: "Açaí Pequeno",
        description: "Refrescante e energético.",
        price: 13.50,
        category: "Doces",
        image: "Açai.jpg",
        image_type: "local",
        options: ["Puro", "Com Banana", "Com Morango", "Com Leite Ninho", "Com Paçoca"]
    },
    {
        name: "Açaí Grande",
        description: "Para quem tem muita fome de açaí.",
        price: 15.50,
        category: "Doces",
        image: "Açai.jpg",
        image_type: "local",
        options: ["Puro", "Com Banana", "Com Morango", "Com Leite Ninho", "Com Paçoca"]
    },
    {
        name: "Todinho",
        description: "Achocolatado clássico.",
        price: 4.00,
        category: "Bebidas",
        image: "kapo.png", // Using kapo as placeholder/similar
        image_type: "local"
    },

    // Lanche Bem
    {
        name: "Lanche Bem (Com Fruta)",
        price: 16.90,
        category: "Lanche Bem",
        image: "Lanche_bem.jpg",
        image_type: "local",
        description: "Lanche diário completo com fruta. (Mensal: R$ 270,40)",
        weekly_menu: [
            { day: "Segunda", item: "Pastel Assado de Frango", beverage: "Suco Natural de Limão", fruit: "Banana" },
            { day: "Terça", item: "Cigarrete de Presunto e Queijo", beverage: "Suco Natural de Uva", fruit: "Maçã" },
            { day: "Quarta", item: "Bolo Caseiro de Cenoura", beverage: "Iogurte de Morango", fruit: "Cubinhos de Abacaxi" },
            { day: "Quinta", item: "Pão de Queijo com Carne", beverage: "Suco Natural de Laranja", fruit: "Melancia" },
            { day: "Sexta", item: "Bisnaguinha com Requeijão", beverage: "Açaí c/ Leite em pó", fruit: "Banana ou Morango" }
        ]
    },
    {
        name: "Lanche Bem (Sem Fruta)",
        price: 12.90,
        category: "Lanche Bem",
        image: "Lanche_bem.jpg",
        image_type: "local",
        description: "Lanche diário completo sem fruta. (Mensal: R$ 206,40)",
        weekly_menu: [
            { day: "Segunda", item: "Pastel Assado de Frango", beverage: "Suco Natural de Limão" },
            { day: "Terça", item: "Cigarrete de Presunto e Queijo", beverage: "Suco Natural de Uva" },
            { day: "Quarta", item: "Bolo Caseiro de Cenoura", beverage: "Iogurte de Morango" },
            { day: "Quinta", item: "Pão de Queijo com Carne", beverage: "Suco Natural de Laranja" },
            { day: "Sexta", item: "Bisnaguinha com Requeijão", beverage: "Açaí c/ Leite em pó" }
        ]
    },

    // Festas
    {
        name: "Combo Festa 1 (25 Crianças)",
        price: 399.00,
        category: "Festas",
        image: "Combo_Festa.jpg",
        image_type: "local",
        description: "Serve 25 crianças! 1 bolo (2,5kg) + 100 salgados + 25 refris. Inclusos: descartáveis.",
        party_kit: {
            totalSnacks: 100,
            snackOptions: [
                "Coxinha", "Cigarrete", "Rissole de Requeijão", "Rissole de Milho",
                "Bolinho de Queijo", "Quibe", "Olho de Coruja",
                "Pastel Assado (Frango c/ Bacon)", "Empadinha", "Churros"
            ]
        }
    },
    {
        name: "Combo Festa 2 (30 Crianças)",
        price: 469.00,
        category: "Festas",
        image: "Combo_Festa.jpg",
        image_type: "local",
        description: "Serve 30 crianças! 1 bolo (2,5kg) + 150 salgados + 30 refris. Inclusos: descartáveis.",
        party_kit: {
            totalSnacks: 150,
            snackOptions: [
                "Coxinha", "Cigarrete", "Rissole de Requeijão", "Rissole de Milho",
                "Bolinho de Queijo", "Quibe", "Olho de Coruja",
                "Pastel Assado (Frango c/ Bacon)", "Empadinha", "Churros"
            ]
        }
    },
    {
        name: "Bolo de Chocolate/Festa (2,5kg)",
        price: 169.00,
        category: "Festas",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        image_type: "url",
        description: "Bolo de chocolate ou festa com cobertura de brigadeiro (2,5kg). Inclusos: vela, pratinhos, talheres e guardanapos."
    }
];
