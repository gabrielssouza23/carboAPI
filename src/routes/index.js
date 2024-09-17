import speciesRoutes from "./species.js";

const router = [
    {
      prefix: "species",
      route: speciesRoutes,
      public: ["/species/species-all, /species/specie-create"],
    },
    {
      prefix: "admins",
      route: usersRoutes,
      private: ["/admins/admins-login"],
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