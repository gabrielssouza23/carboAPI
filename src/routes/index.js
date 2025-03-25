import speciesRoutes from "./species.js";
  import adminsRoutes from "./admins.js";
  import generic from "./generic.js"

const router = [
    {
      prefix: "species",
      route: speciesRoutes,
      public: ["/species/specie/:specieId, /species/species-all-catalog, /species-count, /species/contribution-create"],
      private: ["/species/specie-create, /species/analyze-image"],
    },
    {
      prefix: "admins",
      route: adminsRoutes,
      public: ["/admins/admins-login"],
    },
    {
      prefix: "generic",
      route: generic,
      public: ["/generic/participacao"],
    },

  ];

  export const getPublicRoutes = () => {
    const publicRoutes = router.map((item) => {
      return item.public;
    });
  
    return publicRoutes.flat();
  };
  
  export default function getAllRoutes() {
    return router;
  }