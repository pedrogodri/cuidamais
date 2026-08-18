import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import CaregiverHome from './index';

jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('CaregiverHome', () => {
  it('volta pra tela anterior ao tocar no botão de voltar', async () => {
    await render(<CaregiverHome />);

    await fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));

    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
