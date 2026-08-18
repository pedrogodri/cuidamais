import { render, screen } from '@testing-library/react-native';
import { ReviewsList } from './ReviewsList';

describe('ReviewsList', () => {
  it('mostra autor e comentário de cada avaliação', async () => {
    await render(
      <ReviewsList
        reviews={[
          { id: '1', author: 'Ana Beatriz', rating: 5, comment: 'Muito atenciosa.', date: '10/08' },
          {
            id: '2',
            author: 'Roberto Lima',
            rating: 4,
            comment: 'Boa comunicação.',
            date: '02/08',
          },
        ]}
      />,
    );

    expect(screen.getByText('Ana Beatriz')).toBeTruthy();
    expect(screen.getByText('Muito atenciosa.')).toBeTruthy();
    expect(screen.getByText('Roberto Lima')).toBeTruthy();
    expect(screen.getByText('Boa comunicação.')).toBeTruthy();
  });

  it('mostra uma mensagem quando não há avaliações', async () => {
    await render(<ReviewsList reviews={[]} />);

    expect(screen.getByText('Sem avaliações ainda.')).toBeTruthy();
  });
});
