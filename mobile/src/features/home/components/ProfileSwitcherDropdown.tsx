import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, View } from 'react-native';
import {
  useActiveProfileStore,
  type ActiveProfile,
} from '@/features/auth/store/useActiveProfileStore';
import { MOCK_LINKED_PROFILES } from '@/features/auth/mockLinkedProfiles';
import { getProfileTheme, type ProfileTheme } from '@/features/auth/theme/profileTheme';
import { elevation } from '@/shared/ui/theme';
import { Caption } from '@/shared/ui/Typography';

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Icon-in-circle needs a real color value (Ionicons doesn't read NativeWind
// classes), so each theme's -700 shade is mirrored here as a hex constant.
const ICON_COLOR: Record<ProfileTheme['type'], string> = {
  caregiver: '#123D36',
  cared_person: '#A9721F',
  family: '#A8455F',
};

const NEUTRAL_ICON_COLOR = '#5C6B67';

export function ProfileSwitcherDropdown() {
  const activeProfile = useActiveProfileStore((state) => state.activeProfile);
  const setActiveProfile = useActiveProfileStore((state) => state.setActiveProfile);
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor>({ x: 16, y: 96, width: 0, height: 0 });
  const triggerRef = useRef<View>(null);

  const activeTheme = activeProfile ? getProfileTheme(activeProfile.type) : null;

  function handleOpen() {
    setIsOpen(true);
    // Best-effort: positions the dropdown under the trigger. Falls back to
    // the default anchor above (e.g. in tests, where native layout isn't
    // measured) — opening still works, just anchored to a fixed spot.
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
    });
  }

  function handleSelect(profile: ActiveProfile) {
    setActiveProfile(profile);
    setIsOpen(false);
  }

  return (
    <View>
      <Pressable
        ref={triggerRef}
        accessibilityRole="button"
        accessibilityLabel="Trocar perfil ativo"
        accessibilityState={{ expanded: isOpen }}
        onPress={handleOpen}
        className="min-h-[48px] flex-row items-center gap-2 self-start rounded-pill border-2 border-neutral-100 bg-neutral-100 px-3 py-2 active:bg-neutral-200"
      >
        <Ionicons
          name={activeTheme?.icon ?? 'person-outline'}
          size={16}
          color={activeTheme ? ICON_COLOR[activeTheme.type] : NEUTRAL_ICON_COLOR}
        />
        <Caption
          className={`font-body-medium ${activeTheme ? activeTheme.textClass700 : 'text-neutral-500'}`}
        >
          {activeTheme?.label ?? 'Escolher perfil'}
        </Caption>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={NEUTRAL_ICON_COLOR}
        />
      </Pressable>

      {isOpen ? (
        <Modal transparent visible animationType="fade" onRequestClose={() => setIsOpen(false)}>
          <Pressable
            accessibilityLabel="Fechar seletor de perfil"
            onPress={() => setIsOpen(false)}
            className="flex-1"
            style={{ backgroundColor: 'rgba(38, 48, 46, 0.2)' }}
          >
            <View
              style={{
                position: 'absolute',
                top: anchor.y + anchor.height + 10,
                left: anchor.x,
                width: 12,
                height: 12,
                marginLeft: 14,
                backgroundColor: 'white',
                borderLeftWidth: 1,
                borderTopWidth: 1,
                borderColor: '#E8E4DD',
                transform: [{ rotate: '45deg' }],
              }}
            />
            <View
              accessibilityRole="radiogroup"
              style={[
                elevation.e2,
                {
                  position: 'absolute',
                  top: anchor.y + anchor.height + 16,
                  left: anchor.x,
                  minWidth: Math.max(anchor.width, 200),
                },
              ]}
              className="gap-1 rounded-md border border-neutral-100 bg-white p-2"
            >
              {MOCK_LINKED_PROFILES.map((profile) => {
                const theme = getProfileTheme(profile.type);
                const selected = activeProfile?.type === profile.type;
                return (
                  <Pressable
                    key={profile.type}
                    accessibilityRole="radio"
                    accessibilityLabel={theme.label}
                    accessibilityState={{ selected }}
                    onPress={() => handleSelect(profile)}
                    className={`min-h-[48px] flex-row items-center gap-3 rounded-sm px-3 py-2 ${
                      selected ? theme.bgClass100 : 'active:bg-neutral-50'
                    }`}
                  >
                    <Ionicons
                      name={theme.icon}
                      size={18}
                      color={selected ? ICON_COLOR[theme.type] : NEUTRAL_ICON_COLOR}
                    />
                    <Caption
                      className={`flex-1 font-body-medium ${selected ? theme.textClass700 : 'text-neutral-900'}`}
                    >
                      {theme.label}
                    </Caption>
                    {selected ? (
                      <Ionicons name="checkmark" size={16} color={ICON_COLOR[theme.type]} />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
}
