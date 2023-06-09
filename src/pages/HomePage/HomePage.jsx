import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'

import ShowCard from '../../components/ShowCard'
import SearchBar from '../../components/SearchBar'
import FavoriteCard from '../../components/FavoritesCard'

import api from '../../api'
import { useMedia } from '../../hooks/media'
import { addToFavorites, getFavorites, removeFromFavorites } from '../../utils/favorites'

import { Alert, PageWrap } from '../../globalStyles'
import {
  ShowList,
  FavoritesList,
  FavoriteBlock,
  PageHeaderWrap,
  Pagination,
  ShowMoreButton,
  Notification,
  HeaderTextWrap,
  HeaderSubtitle,
  HeaderTitle,
  SectionTitle,
  TvShowSection,
} from './style'
import './pagination.css'

const HomePage = () => {
  const isMobile = useMedia()

  const itemsPerPage = isMobile ? 10 : 28
  const defaultPaginationPage = 0

  const [pageCount, setPageCount] = useState(defaultPaginationPage)
  const [itemOffset, setItemOffset] = useState(0)

  const [favoritesShow, setFavoritesShow] = useState(getFavorites())
  const [markedShow, setMarkedShow] = useState(null)
  const [isNotificationVisible, setNotificationVisible] = useState(false)

  const { data, error } = api.getTvShowList({
    paginationPage: defaultPaginationPage,
  })

  const toggleFavoritesHandler = (show) => {
    const localFav = getFavorites()
    if (Object.keys(localFav).includes(show.id.toString())) {
      setFavoritesShow(removeFromFavorites(show))
      setMarkedShow({ name: show.name, status: 'removed' })
    } else {
      setFavoritesShow(addToFavorites(show))
      setMarkedShow({ name: show.name, status: 'added' })
    }

    setNotificationVisible(true)

    setTimeout(() => {
      setNotificationVisible(false)
      setMarkedShow(null)
    }, 4000)
  }

  useEffect(() => {
    if (data) {
      setPageCount(Math.ceil(data.length / 30))
    }
  }, [data])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length
    setItemOffset(newOffset)
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const loadMoreShow = () => {
    setItemOffset(itemOffset + itemsPerPage)
  }

  const endOffset = itemOffset + itemsPerPage
  const displayedShows = data
    ? isMobile
      ? data.slice(0, endOffset)
      : data.slice(itemOffset, endOffset)
    : []

  return (
    <PageWrap isMobile={isMobile}>
      <PageHeaderWrap isMobile={isMobile}>
        <HeaderTextWrap>
          <HeaderTitle data-testid="home-title">Welcome to GalaxyPlex!</HeaderTitle>
          <HeaderSubtitle>Your best partner in crime</HeaderSubtitle>
        </HeaderTextWrap>
        <SearchBar />
      </PageHeaderWrap>

      <Notification isVisible={isNotificationVisible} status={markedShow?.status}>
        {`${markedShow?.name} was ${markedShow?.status} ${
          markedShow?.status === 'added' ? 'to' : 'from'
        } your Favorites list!`}
      </Notification>

      {/* FAVORITES SECTION */}
      {Object.values(favoritesShow).length ? (
        <FavoriteBlock>
          <SectionTitle>My Favorites</SectionTitle>
          <FavoritesList>
            {Object.values(favoritesShow).map((show) => (
              <FavoriteCard
                data={show}
                key={show.id}
                toggleFavorites={() => toggleFavoritesHandler(show)}
                isFavorite={Boolean(
                  Object.values(favoritesShow).find((item) => item?.id === show?.id)
                )}
              />
            ))}
          </FavoritesList>
        </FavoriteBlock>
      ) : null}

      {error && <Alert>We have some problem...please reload a page.</Alert>}

      {/* TV SHOW SECTION */}
      {displayedShows && !error && (
        <TvShowSection>
          <SectionTitle>TV Shows</SectionTitle>
          <ShowList data-testid="show-list">
            {displayedShows.map((show) => (
              <ShowCard
                data={show}
                key={show.id}
                toggleFavorites={() => toggleFavoritesHandler(show)}
                isFavorite={Boolean(
                  Object.values(favoritesShow).find((item) => item?.id === show?.id)
                )}
              />
            ))}
          </ShowList>
        </TvShowSection>
      )}

      {/* PAGINATION SECTION */}
      <Pagination data-testid="pagination">
        {isMobile ? (
          <ShowMoreButton onClick={loadMoreShow}>Show more</ShowMoreButton>
        ) : (
          <ReactPaginate
            id="pagination"
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={isMobile ? 3 : pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
          />
        )}
      </Pagination>
    </PageWrap>
  )
}

export default HomePage
