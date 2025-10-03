<script lang="ts">
	import { StandalonePageLayout } from '$lib';
</script>

<StandalonePageLayout>
	<div class="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-16 sm:px-8">
		<header class="space-y-4">
			<p class="text-sm font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
				Contact
			</p>
			<h1 class="text-4xl font-semibold text-gray-900 dark:text-white">
				We’re always happy to help
			</h1>
			<p class="max-w-2xl text-sm text-gray-600 dark:text-gray-300">
				No ticket portals or bots—just a friendly team that loves hearing from you. Reach out any
				time and we’ll follow up within a couple of business hours.
			</p>
		</header>

		<section class="grid gap-6 md:grid-cols-2">
			<article
				class="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80"
			>
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Talk with the team</h2>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
					A real person will read and reply to your note—usually faster than you’d expect.
				</p>
				<ul class="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-300">
					<li class="flex flex-col gap-1">
						<span
							class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
						>
							Email
						</span>
						<a
							href="mailto:support@example.com"
							class="text-base font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
						>
							support@example.com
						</a>
						<span class="text-xs text-gray-500 dark:text-gray-400">Avg. reply: under 2 hours</span>
					</li>
					<li class="flex flex-col gap-1">
						<span
							class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
						>
							Phone
						</span>
						<a
							href="tel:+14155550123"
							class="text-base font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
						>
							+1 (415) 555-0123
						</a>
						<span class="text-xs text-gray-500 dark:text-gray-400">Mon–Fri · 8am – 6pm PT</span>
					</li>
				</ul>
			</article>

			<article
				class="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80"
			>
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">How we support you</h2>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
					We keep a close eye on priority requests and flag anything urgent for immediate action.
				</p>
				<ul class="mt-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
					<li>Technical guidance from the product team</li>
					<li>Billing and account help within one business day</li>
					<li>Weekend on-call for high-priority incidents</li>
				</ul>
				<p class="mt-6 text-xs text-gray-500 dark:text-gray-400">
					Let us know if your message is time-sensitive—those jump to the top of the queue.
				</p>
			</article>
		</section>

		<section
			class="rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 px-6 py-5 text-sm text-primary-700 shadow-sm dark:border-primary-400/40 dark:bg-primary-500/10 dark:text-primary-300"
		>
			<p>
				Thank you for trusting us with your work. Even if you just want to say hello, we’d love to
				hear from you.
			</p>
		</section>
	</div>
</StandalonePageLayout>
