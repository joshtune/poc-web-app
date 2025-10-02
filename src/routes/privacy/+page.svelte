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
						Privacy
					</p>
					<h1 class="text-4xl font-semibold text-gray-900 dark:text-white">Privacy Policy</h1>
					<p class="max-w-2xl text-sm text-gray-600 dark:text-gray-300">
						We build with privacy in mind. This policy explains what data we collect, why we collect
						it, and how we keep it safe.
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">Last updated: January 15, 2025</p>
				</header>

				<section class="space-y-8">
					<article class="space-y-3">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							1. Information we collect
						</h2>
						<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
							We collect the details you provide when creating an account, usage data that helps us
							improve experience, and diagnostic information to keep the platform secure. We do not
							sell personal data.
						</p>
					</article>

					<article class="space-y-3">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">2. How we use data</h2>
						<ul class="list-disc space-y-2 pl-6 text-sm text-gray-600 dark:text-gray-300">
							<li>Operate and maintain the services you depend on.</li>
							<li>Provide support, service updates, and security notices.</li>
							<li>Improve features by studying aggregated, anonymized metrics.</li>
						</ul>
					</article>

					<article class="space-y-3">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							3. Data control and retention
						</h2>
						<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
							You control your content at all times. Delete projects or request data exports from
							the workspace settings page. We retain user accounts only as long as necessary to
							provide the service or comply with legal obligations.
						</p>
					</article>

					<article class="space-y-3">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">4. Your choices</h2>
						<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
							You can manage email preferences, request deletion of your account, or disable
							analytics tracking from your profile. For EU/EEA residents, we act as a data processor
							and honor GDPR requests within 30 days.
						</p>
					</article>

					<article class="space-y-3">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">5. Security</h2>
						<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
							Security is layered across encryption, role-based access, and continuous monitoring.
							If we discover a breach that impacts your data, we will notify you promptly and
							outline remediation steps.
						</p>
					</article>
				</section>

				<footer
					class="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80"
				>
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Need to talk to us?</h2>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
						Contact our privacy team at <a
							href="mailto:privacy@example.com"
							class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
							>privacy@example.com</a
						>.
					</p>
				</footer>
			</div>
		</div>
	</main>
</div>
