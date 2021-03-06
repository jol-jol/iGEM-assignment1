from __future__ import print_function
import sys;

if len(sys.argv) != 4:
	exit(1);

origin = sys.argv[1];
destination = sys.argv[2];
sequence = sys.argv[3].upper();

valid_commands = ['DNA', 'RNA', 'protein'];
if origin not in valid_commands or \
	destination not in valid_commands:
	exit(1);

if origin == destination:
	print(sequence);

def complement(seq):
	output = '';
	compDict = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'};
	for i in range(0, len(seq)):
		if seq[i] not in compDict:
			print("you entered an invalid DNA sequence!",
				file=sys.stderr);
			exit(1);
		output += compDict[seq[i]];
	return output;

def translate(seq):
	codontable = {
	'ATA':'I', 'ATC':'I', 'ATT':'I', 'ATG':'M',
	'ACA':'T', 'ACC':'T', 'ACG':'T', 'ACT':'T',
	'AAC':'N', 'AAT':'N', 'AAA':'K', 'AAG':'K',
	'AGC':'S', 'AGT':'S', 'AGA':'R', 'AGG':'R',
	'CTA':'L', 'CTC':'L', 'CTG':'L', 'CTT':'L',
	'CCA':'P', 'CCC':'P', 'CCG':'P', 'CCT':'P',
	'CAC':'H', 'CAT':'H', 'CAA':'Q', 'CAG':'Q',
	'CGA':'R', 'CGC':'R', 'CGG':'R', 'CGT':'R',
	'GTA':'V', 'GTC':'V', 'GTG':'V', 'GTT':'V',
	'GCA':'A', 'GCC':'A', 'GCG':'A', 'GCT':'A',
	'GAC':'D', 'GAT':'D', 'GAA':'E', 'GAG':'E',
	'GGA':'G', 'GGC':'G', 'GGG':'G', 'GGT':'G',
	'TCA':'S', 'TCC':'S', 'TCG':'S', 'TCT':'S',
	'TTC':'F', 'TTT':'F', 'TTA':'L', 'TTG':'L',
	'TAC':'Y', 'TAT':'Y', 'TAA':'_', 'TAG':'_',
	'TGC':'C', 'TGT':'C', 'TGA':'_', 'TGG':'W',
	};
	aa = '';
	for i in range(0, len(seq)-3, 3):
		if seq[i : i+3] not in codontable:
			print("you entered an invalid sequence!",
				file=sys.stderr);
			exit(1);
		aa += codontable[seq[i : i+3]];
	return aa;

result = "";
if (origin == "DNA"):
	compl = complement(sequence);
	if (destination == "RNA"):
		result = compl.replace('T', 'U');
	else:
		result = translate(compl);
elif (origin == "RNA"):
	temp = sequence.replace('U', 'T');
	if (destination == "DNA"):
		result = complement(temp);
	else:
		result = translate(temp);
else:
	print("Not supported yet", file=sys.stderr);
	exit(1);

print(result);

