import { fireEvent, render, screen } from '@testing-library/react-native';
import { ProfileOptionCard } from './ProfileOptionCard';
import { getProfileTheme } from '@/features/auth/theme/profileTheme';

describe('ProfileOptionCard', () => {
  it('renders the profile label and description', async () => {
    await render(
      <ProfileOptionCard
        theme={getProfileTheme('caregiver')}
        selected={false}
        dimmed={false}
        onPress={() => {}}
      />,
    );
    expect(screen.getByText('Cuidador')).toBeTruthy();
    expect(screen.getByText('Vou oferecer cuidado profissional')).toBeTruthy();
  });

  it('calls onPress when tapped', async () => {
    const onPress = jest.fn();
    await render(
      <ProfileOptionCard
        theme={getProfileTheme('family')}
        selected={false}
        dimmed={false}
        onPress={onPress}
      />,
    );
    await fireEvent.press(screen.getByRole('radio'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('exposes selected state to assistive tech', async () => {
    await render(
      <ProfileOptionCard
        theme={getProfileTheme('cared_person')}
        selected
        dimmed={false}
        onPress={() => {}}
      />,
    );
    expect(screen.getByRole('radio')).toHaveProp('accessibilityState', { selected: true });
  });
});
