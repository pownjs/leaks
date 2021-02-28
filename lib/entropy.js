// see https://gist.github.com/ppseprus/afab8500dec6394c401734cb6922d220

const calculateEntropy = (str) => {
    return [...new Set(str)]
        .map(chr => {
            return str.match(new RegExp(chr, 'g')).length
        })
        .reduce((sum, frequency) => {
            const p = frequency / str.length

            return sum + p * Math.log2(1 / p)
        }, 0)
};

module.exports = { calculateEntropy }
