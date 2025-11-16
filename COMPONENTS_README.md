# OryumAura Modern UI Components

Comprehensive component library with animations, accessibility, and modern design patterns.

## 🎨 Component Overview

### Core Components

#### Button
Modern button component with variants, sizes, and loading states.

```tsx
import { Button } from '../components';

<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>

// Variants: primary, secondary, outline, ghost, danger
// Sizes: sm, md, lg
```

#### Input
Form input with labels, errors, and icon support.

```tsx
import { Input } from '../components';
import { Search } from 'lucide-react';

<Input
  label="Email"
  type="email"
  placeholder="seu@email.com"
  error="Email inválido"
  leftIcon={<Search size={18} />}
  required
/>
```

#### Select
Dropdown select with modern styling.

```tsx
import { Select } from '../components';

<Select
  label="Cargo"
  options={[
    { label: 'Secretário', value: 'secretario' },
    { label: 'Servidor', value: 'servidor' }
  ]}
  required
/>
```

#### Avatar
Avatar with status indicators and badges.

```tsx
import { Avatar, AvatarGroup } from '../components';

<Avatar
  name="João Silva"
  src="/avatar.jpg"
  size="md"
  status="online"
  showStatus
  badge={3}
/>

<AvatarGroup
  avatars={[
    { name: "User 1" },
    { name: "User 2" },
    { name: "User 3" }
  ]}
  max={3}
/>
```

### Data Display

#### Table
Advanced table with sorting, filtering, search, and export.

```tsx
import { Table, Column } from '../components';

const columns: Column<User>[] = [
  {
    key: 'nome',
    label: 'Nome',
    sortable: true,
    filterable: true
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true
  },
  {
    key: 'actions',
    label: 'Ações',
    render: (_, row) => (
      <button onClick={() => handleEdit(row)}>Editar</button>
    )
  }
];

<Table
  columns={columns}
  data={users}
  searchable
  filterable
  exportable
  pagination
  pageSize={10}
  onRowClick={(row) => console.log(row)}
/>
```

#### Card
Flexible card component with header, content, and footer.

```tsx
import Card, { CardHeader, CardContent, CardFooter } from '../components/Card';

<Card hoverable clickable onClick={() => {}}>
  <CardHeader
    title="Card Title"
    subtitle="Subtitle"
    action={<Button size="sm">Action</Button>}
  />
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

#### Badge
Gamification badges with progress tracking.

```tsx
import { Badge } from '../components';

<Badge
  type="trophy"
  label="Mestre SUAS"
  description="Complete 100 atendimentos"
  earned
  progress={75}
  size="md"
/>
```

### Navigation

#### Sidebar
Modern sidebar with animations and collapsible menus.

```tsx
import { Sidebar } from '../components';

// Already integrated in Layout component
// Features:
// - Animated menu items
// - Collapsible submenu
// - Role-based access
// - Mobile responsive
// - Smooth transitions
```

#### CommandPalette
Cmd+K command palette for quick navigation.

```tsx
import { CommandPalette } from '../components';

const [isOpen, setIsOpen] = useState(false);

const commands = [
  {
    id: 'home',
    label: 'Ir para Início',
    icon: <Home size={18} />,
    section: 'Navegação',
    onSelect: () => navigate('/')
  }
];

// Open with Cmd+K or Ctrl+K
<CommandPalette
  items={commands}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

#### Tabs
Tabbed navigation with multiple variants.

```tsx
import { Tabs } from '../components/Tabs';

<Tabs
  tabs={[
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: <Home size={18} />,
      content: <div>Overview content</div>
    },
    {
      id: 'stats',
      label: 'Estatísticas',
      icon: <BarChart size={18} />,
      content: <div>Stats content</div>
    }
  ]}
  variant="pills" // default, pills, underline
  defaultTab="overview"
/>
```

### Feedback

#### Dialog
Modal dialog with animations and keyboard support.

```tsx
import { Dialog } from '../components';

<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmar Ação"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirmar
      </Button>
    </>
  }
>
  <p>Tem certeza que deseja continuar?</p>
</Dialog>
```

#### ToastNotification
Modern toast notifications with animations.

```tsx
import { ToastNotification } from '../components';

const [toasts, setToasts] = useState([]);

<ToastNotification
  toasts={toasts}
  onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
/>

// Add toast
setToasts(prev => [...prev, {
  id: Date.now().toString(),
  message: 'Ação concluída com sucesso!',
  type: 'success' // success, error, info, warning
}]);
```

#### ProgressBar
Animated progress bar with multiple colors.

```tsx
import { ProgressBar } from '../components';

<ProgressBar
  value={75}
  max={100}
  showLabel
  size="md"
  color="green"
  animated
/>
```

#### EmptyState
Empty state component with call-to-action.

```tsx
import { EmptyState } from '../components';
import { Users } from 'lucide-react';

<EmptyState
  icon={Users}
  title="Nenhum usuário encontrado"
  description="Comece adicionando seu primeiro usuário ao sistema"
  action={{
    label: "Adicionar Usuário",
    onClick: () => navigate('/users/new'),
    icon: <Plus size={18} />
  }}
/>
```

#### ErrorBoundary
React error boundary with recovery options.

```tsx
import { ErrorBoundary } from '../components';

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

### Advanced Components

#### KanbanBoard
Drag-and-drop kanban board with Framer Motion.

```tsx
import { KanbanBoard } from '../components';

const columns = [
  {
    id: 'todo',
    title: 'A Fazer',
    color: '#3B82F6',
    cards: [
      {
        id: '1',
        title: 'Tarefa 1',
        description: 'Descrição da tarefa',
        assignee: { name: 'João', avatar: '/avatar.jpg' },
        priority: 'high',
        tags: ['urgente', 'bug'],
        dueDate: '2025-12-01'
      }
    ]
  }
];

<KanbanBoard
  columns={columns}
  onCardMove={(cardId, from, to) => console.log('moved')}
  onCardClick={(card) => console.log(card)}
  onAddCard={(columnId) => console.log('add')}
/>
```

#### Dropdown
Advanced dropdown menu with icons and dividers.

```tsx
import { Dropdown } from '../components';
import { Settings, LogOut } from 'lucide-react';

<Dropdown
  trigger={<Button>Menu</Button>}
  options={[
    {
      label: 'Configurações',
      value: 'settings',
      icon: <Settings size={18} />
    },
    { divider: true },
    {
      label: 'Sair',
      value: 'logout',
      icon: <LogOut size={18} />
    }
  ]}
  onSelect={(value) => console.log(value)}
  align="right"
/>
```

#### Confetti
Celebration confetti animation.

```tsx
import { Confetti } from '../components';

<Confetti
  active={showConfetti}
  duration={3000}
  particleCount={50}
/>
```

## 🎯 Features

### Animations
All components use Framer Motion for smooth, performant animations:
- Spring physics for natural movement
- Layout animations for smooth transitions
- Gesture animations (hover, tap, drag)
- Enter/exit animations with AnimatePresence

### Accessibility
WCAG 2.1 AA compliant:
- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader friendly
- High contrast support

### Mobile Responsive
- Mobile-first design approach
- Touch-friendly interactions
- Responsive breakpoints (sm, md, lg, xl)
- Adaptive layouts

### Dark Mode Ready
All components support future dark mode implementation with CSS variables.

## 🚀 Usage Examples

### Complete Form Example

```tsx
import { Input, Select, Button } from '../components';
import { useForm } from 'react-hook-form';

function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome Completo"
        {...register('name', { required: 'Nome obrigatório' })}
        error={errors.name?.message}
        fullWidth
      />

      <Input
        label="Email"
        type="email"
        {...register('email', { required: 'Email obrigatório' })}
        error={errors.email?.message}
        fullWidth
      />

      <Select
        label="Cargo"
        {...register('role')}
        options={[
          { label: 'Secretário', value: 'secretario' },
          { label: 'Servidor', value: 'servidor' }
        ]}
        fullWidth
      />

      <Button type="submit" fullWidth>
        Salvar
      </Button>
    </form>
  );
}
```

### Dashboard with Stats Cards

```tsx
import Card, { CardHeader, CardContent } from '../components/Card';
import { ProgressBar } from '../components';
import { Users, TrendingUp, CheckCircle } from 'lucide-react';

function Dashboard() {
  const stats = [
    { label: 'Total Usuários', value: 1234, icon: Users, color: 'blue' },
    { label: 'Crescimento', value: '+12%', icon: TrendingUp, color: 'green' },
    { label: 'Concluídos', value: 89, icon: CheckCircle, color: 'purple' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} hoverable>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`text-${stat.color}-600`} size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

## 📦 Component Export

All components are exported from `components/index.ts` for easy importing:

```tsx
import {
  Button,
  Input,
  Table,
  Dialog,
  Avatar,
  KanbanBoard,
  EmptyState,
  ErrorBoundary
} from '../components';
```

## 🎨 Customization

Components use Tailwind CSS classes and can be customized via:
1. className prop for additional styles
2. Tailwind config for global theme changes
3. CSS variables for colors

## 🔧 Dependencies

- React 19.1.1
- Framer Motion 12.23.12
- Lucide React 0.540.0
- Tailwind CSS 4.1.12

## 📝 Notes

- All animations are optimized for performance
- Components are tree-shakeable for smaller bundles
- TypeScript support with full type definitions
- SSR compatible (with proper hydration)

## 🎓 Best Practices

1. **Always wrap your app with ErrorBoundary** for graceful error handling
2. **Use ToastNotification** for user feedback instead of alerts
3. **Implement CommandPalette** for power users
4. **Use EmptyState** instead of just "No data" messages
5. **Leverage animations** but don't overdo them
6. **Test keyboard navigation** on all interactive components
7. **Use semantic HTML** and ARIA attributes for accessibility

---

Built with ❤️ for OryumAura - Sistema SUAS
