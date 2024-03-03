<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { logged_in_store } from "$lib/stores";
    import * as THREE from 'three';

    const OBJECT_COUNT: number = 2;
    let chars: HTMLParagraphElement[] = new Array("authentidocs".length);
    let chapa_big: HTMLParagraphElement;
    let chapas: HTMLDivElement[] = new Array(2);
    let home_root_elem: HTMLDivElement;
    let home_object_elem: HTMLDivElement[] = new Array(OBJECT_COUNT);
    let canvas_root_elem: HTMLDivElement;
    let animated1: boolean = false;
    let multiple: number[] = [5.25, 0];

    onMount(async (): Promise<void> =>
    {
        if($page.data.session)
        {
            await goto("/home");
        }

        window.onresize = (): void =>
        {
            for(let i: number = 0; i < OBJECT_COUNT; ++i)
            {
                home_object_elem[i].style.height = (window.innerHeight - multiple[i] * parseInt(getComputedStyle(document.body).fontSize)).toString() + "px";
            }
        }

        for(let i: number = 0; i < OBJECT_COUNT; ++i)
        {
            home_object_elem[i].style.height = (window.innerHeight - multiple[i] * parseInt(getComputedStyle(document.body).fontSize)).toString() + "px";
        }

        const renderer = new THREE.WebGLRenderer();
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.top = "0";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";

        canvas_root_elem.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, renderer.domElement.clientWidth / renderer.domElement.clientHeight, 0.1, 1000.0);
        const geometry = new THREE.BoxGeometry(1, 1.5, 1);
        const material0 = new THREE.MeshBasicMaterial({color: 0x3c74ed}); // 0x2563eb
        const material1 = new THREE.MeshBasicMaterial({color: 0x2563eb}); // 0x2563eb
        const cube0 = new THREE.Mesh(geometry, material0);
        const cube1 = new THREE.Mesh(geometry, material1);

        cube0.translateX(-1.5);
        cube1.scale.set(0.5, 0.5, 0.5);
        cube1.translateX(2.0);
        cube1.translateY(1.0);
        cube1.translateZ(-1.0);
        scene.add(cube0);
        scene.add(cube1);

        camera.position.z = 5;
        let count: number = 0;

        function animate() {
            requestAnimationFrame( animate );

            cube0.rotation.x += 0.01;
            cube0.rotation.y += 0.01;
            cube1.rotation.x += 0.01;
            cube1.rotation.y += 0.01;
            cube0.position.y = -0.1 + 0.25 * Math.sin(count);
            count += 0.005;

            renderer.render(scene, camera);
        }

        animate();

        renderer.render(scene, camera);
        renderer.setClearAlpha(0.0);
        renderer.clearColor();

        chars[0].animate(
        [
            {
                translate: "0 100%",
                easing: "ease-out"
            },
            {
                translate: "0 0"
            }
        ], 250);
        chars[1].animate(
        [
            {
                translate: "-100% 0",
            },
            {
                translate: "-100% 0",
                offset: 0.5,
                easing: "ease-out"
            },
            {
                translate: "0 0"
            }
        ], 500);
        chars[2].animate(
        [
            {
                opacity: "0",
                easing: "ease-in"
            },
            {
                opacity: "100%"
            }
        ], 250);
        chars[3].animate(
        [
            {
                translate: "0 -100%",
                easing: "ease-out"
            },
            {
                translate: "0 10%",
                easing: "ease-in",
                offset: 0.7
            },
            {
                translate: "0 0"
            }
        ], 250);
        chars[5].animate(
        [
            {
                translate: "100% 0"
            },
            {
                translate: "100% 0",
                offset: 0.5,
                easing: "ease-out"
            },
            {
                translate: "0 0"
            },
        ], 300);
        chars[6].animate(
        [
            {
                scale: "30% 30%",
                easing: "ease-in"
            },
            {
                scale: "70% 70%",
                offset: 0.3
            },
            {
                scale: "70% 70%",
                offset: 0.7,
                easing: "ease-out"
            },
            {
                scale: "100% 100%"
            },
        ], 300);
        chars[7].animate(
        [
            {
                translate: "0 -100%",
                easing: "ease-out"
            },
            {
                translate: "0 0"
            }
        ], 250);
        chars[8].animate(
        [
            {
                translate: "-10% -10%",
                opacity: "0%"
            },
            {
                translate: "-10% -10%",
                opacity: "0%",
                easing: "ease-in",
                offset: 0.2
            },
            {
                translate: "-10% -10%",
                opacity: "100%",
                easing: "ease-out",
                offset: 0.5
            },
            {
                translate: "0 -10%",
                easing: "ease-out",
                offset: 0.75
            },
            {
                translate: "0 0",
            }
        ], 500);
        chars[9].animate(
        [
            {
                translate: "-10% 10%",
                opacity: "0%"
            },
            {
                translate: "-10% 10%",
                opacity: "0%",
                easing: "ease-in",
                offset: 0.2
            },
            {
                translate: "-10% 10%",
                opacity: "100%",
                easing: "ease-out",
                offset: 0.5
            },
            {
                translate: "-10% 0",
                easing: "ease-out",
                offset: 0.75
            },
            {
                translate: "0 0",
            }
        ], 500);
        chars[10].animate(
        [
            {
                translate: "10% -10%",
                opacity: "0%"
            },
            {
                translate: "10% -10%",
                opacity: "0%",
                easing: "ease-in",
                offset: 0.2
            },
            {
                translate: "10% -10%",
                opacity: "100%",
                easing: "ease-out",
                offset: 0.5
            },
            {
                translate: "0 -10%",
                easing: "ease-out",
                offset: 0.75
            },
            {
                translate: "0 0",
            }
        ], 500);
        chars[11].animate(
        [
            {
                translate: "10% 10%",
                opacity: "0%"
            },
            {
                translate: "10% 10%",
                opacity: "0%",
                easing: "ease-in",
                offset: 0.2
            },
            {
                translate: "10% 10%",
                opacity: "100%",
                easing: "ease-out",
                offset: 0.5
            },
            {
                translate: "10% 0",
                easing: "ease-out",
                offset: 0.75
            },
            {
                translate: "0 0",
            }
        ], 500);
        renderer.domElement.animate(
        [
            {
                opacity: 0
            },
            {
                opacity: 0,
                easing: "ease-in",
                offset: 0.5
            },
            {
                opacity: 1
            }
        ], 1200);

        home_object_elem[1].onmouseenter = (): void =>
        {
            if(animated1)
            {
                return;
            }

            function set_animated(): void
            {
                animated1 = true;

                for(let i: number = 0; i < 3; ++i)
                {
                    if(anim_finish[i] !== true)
                    {
                        animated1 = false;

                        break;
                    }
                }
            }

            let anim_finish: boolean[] = [false, false, false];

            chapa_big.animate(
            [
                {
                    opacity: 0,
                    easing: "ease-in"
                },
                {
                    opacity: 1
                }
            ], 250).onfinish = (): void =>
            {
                chapa_big.style.opacity = "1";
                anim_finish[0] = true;

                set_animated();
            };
            chapas[0].animate(
            [
                {
                    translate: "100% 0",
                },
                {
                    translate: "100% 0",
                    easing: "ease-in",
                    offset: 1 / 3
                },
                {
                    translate: "0 0"
                }
            ], 750).onfinish = (): void =>
            {
                chapas[0].style.translate = "0 0";
                anim_finish[1] = true;

                set_animated();
            };
            chapas[1].animate(
            [
                {
                    translate: "-100% 0",
                },
                {
                    translate: "-100% 0",
                    easing: "ease-in",
                    offset: 1 / 3
                },
                {
                    translate: "0 0"
                }
            ], 750).onfinish = (): void =>
            {
                chapas[1].style.translate = "0 0";
                anim_finish[2] = true;

                set_animated();
            };
        };
    });
</script>

<div bind:this={canvas_root_elem} class="canvas-3d">

</div>

<div bind:this={home_root_elem}>
    <div bind:this={home_object_elem[0]} class="home-object">
        <div class="flex">
            <div class="">
                <p bind:this={chars[0]} class="title text-semibold text-gray-700">A</p>
            </div>
            <div class="char-carrier">
                <p bind:this={chars[1]} class="title text-semibold text-gray-700">U</p>
            </div>
            <div class="char-carrier">
                <p bind:this={chars[2]} class="title text-semibold text-gray-700">T</p>
            </div>
            <div class="char-carrier">
                <p bind:this={chars[3]} class="title text-semibold text-gray-700">H</p>
            </div>
            <div class="char-carrier">
                <p bind:this={chars[4]} class="title text-semibold text-gray-700">E</p>
            </div>
            <div class="char-carrier">
                <p bind:this={chars[5]} class="title text-semibold text-gray-700">N</p>
            </div>
            <div class="char-carrier">
                <p bind:this={chars[6]} class="title text-semibold text-gray-700">T</p>
            </div>
            <div>
                <p bind:this={chars[7]} class="title text-semibold text-gray-700">I</p>
            </div>
            <div>
                <p bind:this={chars[8]} class="title text-semibold text-gray-700">D</p>
            </div>
            <div>
                <p bind:this={chars[9]} class="title text-semibold text-blue-600">O</p>
            </div>
            <div>
                <p bind:this={chars[10]} class="title text-semibold text-gray-700">C</p>
            </div>
            <div>
                <p bind:this={chars[11]} class="title text-semibold text-gray-700">S</p>
            </div>
        </div>
    </div>
    
    <div bind:this={home_object_elem[1]} class="home-object flex flex-col">
        <p bind:this={chapa_big} class="chapa-root-1 text-gray-700" style="opacity: 0;">Your Most Trusted</p>
        <div class="chapa-root-2 text-gray-700 flex jusitify-center">
            <div class="overflow-hidden grow flex flex-col items-end">
                <div bind:this={chapas[0]} style="translate: 100% 100%;">Document <span class="text-blue-600">S</span></div>
            </div>
            <div class="overflow-hidden grow flex flex-col items-start">
                <div bind:this={chapas[1]} style="translate: -100% -100%;"><span class="text-blue-600">igning</span> App</div>
            </div>
        </div>
    </div>
</div>

<style>
    .home-object
    {
        position: relative;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .canvas-3d
    {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;
        filter: blur(150px);
    }
    .char-carrier
    {
        overflow: hidden;
    }
    .title
    {
        font-size: 12em;
        line-height: 1em;
    }
    .chapa-root-1
    {
        font-size: 8em;
    }
    .chapa-root-2
    {
        font-size: 4em;
    }
    @media(max-width: 1500px)
    {
        .title
        {
            font-size: 10em;
            line-height: 0.8em;
        }
    }
    @media(max-width: 1400px)
    {
        .title
        {
            font-size: 8em;
            line-height: 0.8em;
        }
        .chapa-root-1
        {
            font-size: 6em;
        }
    }
</style>