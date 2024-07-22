export function addLineBreaks(str: string): string {
	const words = str.split(' ')
	const result: string[] = []

	let currentLine = ''

	for (const word of words) {
		if (currentLine.length + word.length <= 10) {
			currentLine += word + ' '
		} else {
			result.push(currentLine.trim())
			currentLine = word + ' '
		}
	}

	if (currentLine) {
		result.push(currentLine.trim())
	}

	return result.join('\n')
}

export function countChars(str: string, char: string): number {
	return (str.match(new RegExp(char, 'g')) || []).length
}