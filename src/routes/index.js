import speciesRoutes from "./species.js";
  import adminsRoutes from "./admins.js";

const router = [
    {
      prefix: "species",
      route: speciesRoutes,
      public: ["/species/specie/:specieId, /species/species-all-catalog ,  /species/specie-create, /species/specie-contributions/:specieId, /species/specie-locations/:specieId"],
    },
    {
      prefix: "admins",
      route: adminsRoutes,
      public: ["/admins/admins-login"],
    }
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