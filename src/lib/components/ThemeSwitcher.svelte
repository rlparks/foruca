<script lang="ts">
	let theme: "light" | "dark" = $state("dark");

	function handleClick() {
		theme = theme === "dark" ? "light" : "dark";
		window.localStorage.setItem("theme", theme);
	}

	$effect(() => {
		theme = window.localStorage.getItem("theme") as "light" | "dark";
		theme === "dark" ? setDarkTheme() : setLightTheme();
	});

	function setDarkTheme() {
		document.documentElement.classList.add("theme-dark");
		document.documentElement.classList.remove("theme-light");
	}

	function setLightTheme() {
		document.documentElement.classList.add("theme-light");
		document.documentElement.classList.remove("theme-dark");
	}
</script>

<button class="button" onclick={handleClick}>{theme === "dark" ? "🌆" : "🏙️"}</button>
