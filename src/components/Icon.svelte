<script lang="ts">
  type Flip = "vertical" | "horizontal" | "v" | "h";

  export let path: string;
  export let size: number = 1;
  export let flip: Flip = null;
  export let rotate: number = 0;
  export let title = "";

  const getStyles = (size: number, flip: Flip, rotate: number) => {
    const transform: string[] = [];
    const styles: Array<[name: string, property: any]> = [];

    // Transform
    if (flip == "v" || flip == "vertical") transform.push("scaleX(-1)");
    if (flip == "h" || flip == "horizontal") transform.push("scaleY(-1)");
    if (rotate != 0) transform.push(`rotate(${rotate}deg)`);

    if (transform.length > 0) {
      styles.push(["transform", transform.join(" ")]);
      styles.push(["transform-origin", "center"]);
    }

    // Styles
    const sizeString = `${size}em`;
    styles.push(["width", sizeString]);
    styles.push(["height", sizeString]);

    return styles.reduce((cur, item) => {
      return `${cur} ${item[0]}:${item[1]};`;
    }, "");
  };

  $: style = getStyles(size, flip, rotate);
</script>

<svg viewBox="0 0 24 24" {style}>
  {#if title}<title>{title}</title>{/if}

  <path d={path} />
</svg>

<style>
  svg {
    vertical-align: middle;
    fill: var(color, "black");
  }
</style>
