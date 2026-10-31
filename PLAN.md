# New layout architecture
This is the plan to rearchitecture the layout of the current application.
The app consists of a UI with one `md` breakpoint that splits two different layouts (phone & desktop)
The root layout component is in @src/components/Layout.tsx

## Mobile layout
Navbar @src/components/Navigation/NavigationTabs.tsx at the bottom, fixed position.
Content above.

## Desktop layout
Navbar @src/components/Navigation/NavigationTabs.tsx at the top, fixed position.
Content below.

## Hybrid tablet layout
In case of ipad, when in vertical the app displays the phone layout and when in landscape the desktop, this is the correct behaviour as the md breakpoint sits in the middle

## Special layout
When search navbar icon is longtapped a global searchbar appears at the top displaying the list of results (movies & shows collected by the user) on top of whatever page they are.

## Technical details
- React 19
- CSS framework used is tailwind
- React-router for navigation
- PWA

## Screens
- /movies: List of items layout. Watched and watchlist tabs fixed at the top. Rest of the content scrollable.
- /movies/:id Detail layout
- /shows: List of items layout. Watched and watchlist tabs fixed at the top. Rest of the content scrollable.
- /shows/:id Detail layout
- /person: Detail layout. Current layout without changes, poster fixed at the top and rest of the content can be scrolled over the poster.
- /search: List of horizontal items layout. Searchbar and filters fixed at the top. Rest of the content scrollable.
- /profile: Profile Layout. Theme and language selectors fixed at the top. Rest of the content scrollable.

## Current problems
- ios and ipados problems with safe areas. Top and bottom are mostly handled correctly. Lateral safe areas (esp. in landscape ipohne) not handled at all. Moreover ios27 added a blur at the top of the PWA if there is no a static element, so this might be a good oportunity to fix
- As height & width is not fixed, having to deal constantly with unexpected overflows, and some negative margins. One of the goals of this rearchitecture is to get rid of those problems and patches.

## Ideal solution
The ideal solution, subject to investigation, is to have a single css grid layout that can host the different

## Screenshots
![List of items layout - phone](image.png)
![Detail - phone](image-1.png)
![Detail scrolled - phone](image-2.png)
![List of horizontal items layout - phone (Search page) ](image-3.png)
![Profile - phone](image-4.png)
![Special layout over shows watched page - phone](image-5.png)