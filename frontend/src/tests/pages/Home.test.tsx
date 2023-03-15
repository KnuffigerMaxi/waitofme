import { render } from '@testing-library/react'
import Home from '../../components/DepartureRow'

test('renders hello world message', () => {
    render(<Home departures={undefined} />)
/*     const greetings = screen.getByText(/Hello world/i)
    expect(greetings).toBeInTheDocument() */
})
