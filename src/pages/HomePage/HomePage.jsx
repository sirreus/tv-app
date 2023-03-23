import React, { useEffect, useState } from "react";

import ShowCard from "../../components/ShowCard";
import FavoriteCard from "../../components/FavoritesCard/FavoritesCard";

import api from "../../api";
import {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} from "../../utils/favorites";

import { Alert } from "../../globalStyles";
import { PageWrap, ShowList, FavoritesList, FavoriteBlock } from "./style";

const HomePage = () => {
  const defaultPaginationPage = 0;

  const [paginationPage, setPaginationPage] = useState(defaultPaginationPage);
  const [favorites, updateFavorites] = useState([]);

  const { data, error } = api.getTvShowList({ paginationPage });

  useEffect(() => {
    updateFavorites(Object.values(getFavorites()));
  }, []);

  const toggleFavoritesHandler = (show) => {
    const localFav = getFavorites();
    if (Object.keys(localFav).includes(show.id.toString())) {
      updateFavorites(removeFromFavorites(show));
    } else {
      updateFavorites(addToFavorites(show));
    }
  };

  return (
    <PageWrap>
      <h2>Welcome to GalaxyPlex!</h2>
      {error && <Alert>We have some problem...please reload a page.</Alert>}

      {Object.values(getFavorites()).length ? (
        <FavoriteBlock>
          <h2>My Favorites</h2>
          <div style={{ width: "inherit" }}>
            <FavoritesList>
              {Object.values(getFavorites()).map((show) => (
                <FavoriteCard
                  data={show}
                  key={show.id}
                  toggleFavorites={() => toggleFavoritesHandler(show)}
                  isFavorite={Boolean(
                    Object.values(getFavorites()).find(
                      (item) => item?.id === show?.id
                    )
                  )}
                />
              ))}
            </FavoritesList>
          </div>
        </FavoriteBlock>
      ) : null}

      {data && !error && (
        <>
          <h2>TV Shows</h2>
          <ShowList>
            {data &&
              data.map((show) => (
                <ShowCard
                  data={show}
                  key={show.id}
                  toggleFavorites={() => toggleFavoritesHandler(show)}
                  isFavorite={Boolean(
                    Object.values(getFavorites()).find(
                      (item) => item?.id === show?.id
                    )
                  )}
                />
              ))}
          </ShowList>
        </>
      )}
    </PageWrap>
  );
};

export default HomePage;
