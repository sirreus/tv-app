/* eslint-disable import/first */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { fetchData } from './testData'
import ShowCard from '../components/ShowCard'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const setupComponent = () => {
  return render(<ShowCard data={fetchData.data[0]} />)
}

describe('Render TV Show card', () => {
  it('basic show data should displayed in component', () => {
    setupComponent()

    const showData = fetchData.data[0]

    expect(screen.getByTestId(`show-img-${showData.id}`)).toHaveStyle(
      `background-image: url(${showData.image.medium})`
    )
    expect(screen.getByTestId('show-name')).toHaveTextContent(showData.name)
    expect(screen.getByTestId('show-info')).toHaveTextContent(
      showData.genres.join(', '),
      showData.premiered,
      showData.rating.average
    )
  })

  it('click on show card should navigate to Show page', () => {
    setupComponent()

    const showData = fetchData.data[0]

    const card = screen.getByTestId(`show-img-${showData.id}`)
    fireEvent.click(card)

    expect(mockNavigate).toHaveBeenCalledWith(`show/${showData.id}`)
  })
})
