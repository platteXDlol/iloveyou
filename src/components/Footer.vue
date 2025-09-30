<template>
	<footer class="main-footer">
		<div class="footer-content">
			<router-link to="/"><img src="../assets/logo.png" alt="Logo" class="footer-brand" width="40" height="40"/></router-link>
			<span class="footer-text">&copy; 2025 iloveyou. All rights reserved.</span>
					<div class="footer-social">
						<a href="https://github.com/platteXDlol/iloveyou" target="_blank" aria-label="GitHub" class="footer-icon">
							<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.525.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.339-.012 2.421-.012 2.751 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
						</a>
					</div>
		</div>
	</footer>
</template>

<style scoped>
.main-footer {
	width: 100vw;
	position: fixed;
	left: 0;
	bottom: 0;
	background: linear-gradient(90deg, #7f5af0 0%, #0ea5e9 100%);
	color: #fff;
	padding: 1rem 0 0.7rem 0;
	box-shadow: 0 -2px 8px rgba(0,0,0,0.04);
	z-index: 100;
}
.footer-content {
	max-width: 1200px;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 1.5rem;
}
.footer-brand {
	font-family: 'Montserrat', Arial, sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
	letter-spacing: 0.1em;
}
.footer-text {
	font-size: 1rem;
	opacity: 0.8;
}
.footer-social {
	display: flex;
	gap: 1.2rem;
}
.footer-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: rgba(255,255,255,0.08);
	transition: background 0.2s;
}
.footer-icon:hover {
	background: rgba(255,255,255,0.18);
}
@media (max-width: 700px) {
	.footer-content {
		flex-direction: column;
		align-items: center;
		gap: 0.7rem;
		text-align: center;
	}
	.footer-brand {
		font-size: 1.2rem;
	}
	.footer-text {
		font-size: 0.9rem;
	}
}
</style>
