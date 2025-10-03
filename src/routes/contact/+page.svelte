<script lang="ts">
	import { StandalonePageLayout } from '$lib';

	const contacts = [
		{ label: 'Customer success', value: 'support@example.com' },
		{ label: 'Sales inquiries', value: 'sales@example.com' },
		{ label: 'Billing team', value: 'billing@example.com' }
	] as const;

	const offices = [
		{
			name: 'San Francisco',
			address: ['500 Market Street', 'Suite 1200', 'San Francisco, CA 94103'],
			availability: 'Mon–Fri · 9am – 5pm PT'
		},
		{
			name: 'Berlin',
			address: ['Rosenthaler Str. 43', '10178 Berlin', 'Germany'],
			availability: 'Mon–Fri · 9am – 6pm CET'
		}
	] as const;
</script>

<StandalonePageLayout>
	<div class="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-16 sm:px-8">
		<header class="space-y-4">
			<p class="text-sm font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
				Contact
			</p>
			<h1 class="text-4xl font-semibold text-gray-900 dark:text-white">
				We would love to hear from you
			</h1>
			<p class="max-w-2xl text-sm text-gray-600 dark:text-gray-300">
				Reach out to the team with product questions, partnership ideas, or billing requests. We
				reply to every message within one business day.
			</p>
		</header>

		<section class="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
			<form
				class="space-y-6 rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80"
			>
				<div class="grid gap-6 sm:grid-cols-2">
					<label class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
						<span class="font-medium">Full name</span>
						<input
							type="text"
							placeholder="Jane Doe"
							required
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
						/>
					</label>
					<label class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
						<span class="font-medium">Email</span>
						<input
							type="email"
							placeholder="jane.doe@example.com"
							required
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
						/>
					</label>
				</div>
				<label class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
					<span class="font-medium">How can we help?</span>
					<textarea
						rows="6"
						placeholder="Share a few details so we can connect you with the right teammate."
						required
						class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
					></textarea>
				</label>
				<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p class="text-xs text-gray-500 dark:text-gray-400">
						We respect your privacy and never share your details.
					</p>
					<button
						type="submit"
						class="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400"
					>
						Send message
					</button>
				</div>
			</form>

			<div class="space-y-8">
				<section class="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Direct contacts</h2>
					<ul class="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
						{#each contacts as entry (entry.value)}
							<li class="flex flex-col">
								<span class="font-medium text-gray-900 dark:text-white">{entry.label}</span>
								<a
									class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
									href={`mailto:${entry.value}`}
								>
									{entry.value}
								</a>
							</li>
						{/each}
					</ul>
				</section>

				<section class="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Offices</h2>
					<ul class="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
						{#each offices as office (office.name)}
							<li>
								<p class="font-medium text-gray-900 dark:text-white">{office.name}</p>
								<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{office.availability}</p>
								<p class="mt-2 whitespace-pre-line text-sm">{office.address.join('\n')}</p>
							</li>
						{/each}
					</ul>
				</section>
			</div>
		</section>
	</div>
</StandalonePageLayout>
