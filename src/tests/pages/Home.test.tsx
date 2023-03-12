import { render, screen } from '@testing-library/react'
import Home from '../../components/DepartureList'

test('renders hello world message', () => {
    render(<Home />)
    const greetings = screen.getByText(/Hello world/i)
    expect(greetings).toBeInTheDocument()
})
