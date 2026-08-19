import { fireEvent, render, screen } from '@testing-library/react-native';
import { SearchFilters } from './SearchFilters';

describe('SearchFilters', () => {
  it('chama onQueryChange ao digitar no campo de busca', async () => {
    const onQueryChange = jest.fn();
    await render(
      <SearchFilters
        query=""
        onQueryChange={onQueryChange}
        specialties={['Idosos', 'Pediatria']}
        selectedSpecialty={null}
        onSelectSpecialty={jest.fn()}
      />,
    );

    await fireEvent.changeText(screen.getByLabelText('Buscar cuidador'), 'Maria');

    expect(onQueryChange).toHaveBeenCalledWith('Maria');
  });

  it('chama onSelectSpecialty com o nome da especialidade tocada', async () => {
    const onSelectSpecialty = jest.fn();
    await render(
      <SearchFilters
        query=""
        onQueryChange={jest.fn()}
        specialties={['Idosos', 'Pediatria']}
        selectedSpecialty={null}
        onSelectSpecialty={onSelectSpecialty}
      />,
    );

    await fireEvent.press(screen.getByText('Pediatria'));

    expect(onSelectSpecialty).toHaveBeenCalledWith('Pediatria');
  });

  it('chama onSelectSpecialty com null ao tocar em "Todos"', async () => {
    const onSelectSpecialty = jest.fn();
    await render(
      <SearchFilters
        query=""
        onQueryChange={jest.fn()}
        specialties={['Idosos']}
        selectedSpecialty="Idosos"
        onSelectSpecialty={onSelectSpecialty}
      />,
    );

    await fireEvent.press(screen.getByText('Todos'));

    expect(onSelectSpecialty).toHaveBeenCalledWith(null);
  });
});
