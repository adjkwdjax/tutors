import { Alert, Button, Card, Stack, Text, Pill } from '@mantine/core';

export default function Payment() {
	return (
		<Card withBorder radius="md" p="md" maw={360}>
			<Stack gap={8}>
				<Text fw={700} size="lg">
					Тбанк
				</Text>
                
                <div className='flex gap-2'>
                    <Text fw={600}>+7 996 313-47-38</Text>
                    <Text c="dimmed">Антон К.</Text>
                </div>
                <Text fw={700} size="xl" c="green.7">
					700 ₽
				</Text>
				<Button fullWidth mt="xs" color='green'>
					Оплачено
				</Button>
			</Stack>
		</Card>
	);
}
