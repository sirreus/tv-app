import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import api from '../../api'

import {
  PageWrap,
  GoBackButton,
  GoBackButtonIcon,
  PageHeader,
  PageTitle,
  InfoBlock,
  Cover,
  InfoBlockTitle,
  Alert,
  Logo,
} from '../../globalStyles'
import routes from '../../routes'
import { SeasonEpisodeInfoWrapper, SeasonEpisodeList, BoldText, Text } from './style'

const TvShowSeasonPage = () => {
  const navigate = useNavigate()
  const { id, seasonNumber } = useParams()

  const [currentSeason, setCurrentSeason] = useState(null)
  // const [seasonsEpisodes, setSeasonsEpisodes] = useState(null);

  const { data: showInfo, error: showInfoError } = api.getTvShowInfo({
    showId: id,
  })

  const { data: showSeasons, error: showSeasonsError } = api.getTvShowSeasons({
    showId: id,
  })

  useEffect(() => {
    if (showSeasons && seasonNumber) {
      const seasonData = showSeasons.find(
        (season) => season?.number === Number(seasonNumber)
      )
      setCurrentSeason(seasonData)
    }
  }, [seasonNumber, showSeasons])

  const { data: seasonsEpisodes, error: SeasonsEpisodesError } =
    api.getTvShowSeasonsEpisodes({
      seasonId: currentSeason?.id,
    })

  if (showSeasonsError || showInfoError)
    return <>Something went wrong!...please reload a page.</>

  const episodesAmount = seasonsEpisodes ? `(${seasonsEpisodes.length} Episodes)` : ''

  return (
    <PageWrap>
      <Logo onClick={() => navigate(routes.main)}>GalaxyPlex</Logo>
      <PageHeader>
        <GoBackButton onClick={() => navigate(-1)}>
          <GoBackButtonIcon />
        </GoBackButton>
        <PageTitle>{`${showInfo?.name} / Season ${seasonNumber} ${episodesAmount}`}</PageTitle>
      </PageHeader>

      {showSeasonsError && (
        <Alert>The Season data doesn't loaded!...try to reload a page.</Alert>
      )}

      {currentSeason && !showSeasonsError && (
        <InfoBlock>
          <Cover url={currentSeason?.image?.original} />
          <SeasonEpisodeInfoWrapper>
            <InfoBlockTitle>
              <BoldText>
                {`Season premiere date:`}
                <Text>{currentSeason?.premiereDate}</Text>
              </BoldText>
            </InfoBlockTitle>

            <SeasonEpisodeList>
              {SeasonsEpisodesError && <Alert>List of Episodes doesn't loaded</Alert>}
              {seasonsEpisodes &&
                !SeasonsEpisodesError &&
                seasonsEpisodes.map((episode) => (
                  <div key={episode?.number}>
                    <BoldText
                      onClick={() =>
                        navigate(
                          `/tv-show/${id}/season/${seasonNumber}/episode/${episode?.number}`
                        )
                      }
                    >
                      {`Episode ${episode?.number}:`}
                      <Text>{episode?.name}</Text>
                    </BoldText>
                  </div>
                ))}
            </SeasonEpisodeList>
          </SeasonEpisodeInfoWrapper>
        </InfoBlock>
      )}
    </PageWrap>
  )
}

export default TvShowSeasonPage
