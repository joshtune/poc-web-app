<script>
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.png';
	import { ThemeToggle } from '$lib';
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
	<header
		class="flex items-center justify-between border-b border-gray-200 bg-white/90 px-6 py-4 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90"
	>
		<a
			href={resolve('/')}
			class="flex items-center gap-2 text-gray-900 hover:text-primary-600 dark:text-white"
		>
			<img src={favicon} alt="Logo" class="h-8 w-8" />
			<span class="text-lg font-semibold">Auth App</span>
		</a>
		<ThemeToggle />
	</header>

	<main class="flex-1">
		<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div class="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-16 sm:px-8">
				<header class="space-y-4">
					<p
						class="text-sm font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400"
					>
						Terms
					</p>
					<h1 class="text-4xl font-semibold text-gray-900 dark:text-white">Terms of Service</h1>
					<p class="max-w-2xl text-sm text-gray-600 dark:text-gray-300">
						Thanks for using our platform. These terms outline how we work together and what you can
						expect while you build with the product.
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">Last updated: January 15, 2025</p>
				</header>

				<section class="space-y-8">
					<article class="space-y-3">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							1. Using the service
						</h2>
						<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
							You must be at least 18 years old and provide accurate registration details. You are
							responsible for maintaining the security of your account and any activity under your
							credentials. We may update the service over time; material changes will be announced
							in advance.
						</p>
					</article>

					<article class="space-y-3">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">2. Acceptable use</h2>
						<ul class="list-disc space-y-2 pl-6 text-sm text-gray-600 dark:text-gray-300">
							<li>Do not attempt to compromise the security or availability of the platform.</li>
							<li>Only process data for which you have the legal right and proper consent.</li>
							<li>Respect rate limits and avoid abusive or automated scraping behavior.</li>
						</ul>
					</article>

					<article class="space-y-3">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							3. Billing & subscriptions
						</h2>
						<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
							Paid plans renew automatically unless cancelled before the end of the billing cycle.
							Fees are non-refundable except where required by law. Upgrading or downgrading your
							plan may adjust your next invoice.
						</p>
					</article>

					<article class="space-y-3">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							4. Intellectual property
						</h2>
						<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
							We own the platform, codebase, and documentation. You retain all rights to your
							content. By uploading content, you grant us a limited license to host and transmit it
							for the purpose of providing the service.
						</p>
					</article>

					<article class="space-y-3">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">5. Termination</h2>
						<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
							You may close your account at any time. We may suspend or terminate access if these
							terms are violated, after reasonable notice when possible. Upon termination, we will
							make reasonable efforts to allow you to export your data.
						</p>
					</article>
				</section>

				<footer
					class="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80"
				>
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Questions?</h2>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
						Reach out to <a
							href="mailto:legal@example.com"
							class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
							>legal@example.com</a
						> if you have any questions about these terms.
					</p>
				</footer>
			</div>
		</div>
	</main>
</div>
